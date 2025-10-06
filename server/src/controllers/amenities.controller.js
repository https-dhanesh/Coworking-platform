import pool from '../config/db.config.js'

export const getAllAmenities = async (req,res) =>{
    try{
        const allAmenities = await pool.query("SELECT * FROM Amenities");
        res.json(allAmenities.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

export const addAmenitiesToSpace = async (req,res) =>{
    try{
        const {space_id,amenity_id}=req.body;
        const userId = req.user.id;
        const spaceResult = await pool.query("SELECT owner_id FROM spaces WHERE id = $1", [space_id]);
        if(spaceResult.rows.length===0){
            return res.status(404).json({error:" Space not found "});
        }
        if(spaceResult.rows[0].owner_id!=userId){
            return res.status(403).json({error: "User not Authorized"});
        }

        const newLink = await pool.query("INSERT into space_amenities(space_id, amenity_id) VALUES ($1, $2) RETURNING *",
        [space_id, amenity_id]);
        res.status(201).json(newLink.rows[0])
        }catch(err){
        if(err.code==='23505'){
            return res.status(400).json({error: 'The amenity has already been added to the space'});
        }
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

export const getAmenitiesBySpace = async(req,res)=>{
    try{
        const {spaceId} = req.params;
        const query = `Select a.id, a.name from amenities a Join space_amenities sa ON a.id = sa.amenity_id
      WHERE sa.space_id = $1`;
      const amenities = await pool.query(query,[spaceId]);
      res.json(amenities.rows);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}