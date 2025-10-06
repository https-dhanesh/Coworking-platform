import pool from "../config/db.config.js";
import cloudinary from '../config/cloudinary.config.js';

export const createSpace = async (req, res) => {
    try {
        const { name, description, address, price_per_day } = req.body;
        const ownerId = req.user.id;
        let imageUrl = null;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "coworking-spaces",
            });
            imageUrl = result.secure_url;
        }
        const newSpace = await pool.query("INSERT INTO spaces (owner_id, name, description, address, price_per_day,image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [ownerId, name, description, address, price_per_day, imageUrl]
        );
        res.status(201).json(newSpace.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
}

export const getAllSpaces = async (req, res) => {
    try {
        const { amenities } = req.query;
        if (amenities) {
            const amenityIds = amenities.split(',').map(id => parseInt(id));
            const query = `Select s.* from spaces s join space_amenities sa ON s.id = sa.space_id where sa.amenity_id = ANY($1::int[]) GROUP BY s.id having count(distinct sa.amenity_id) = $2`;
            const filteredSpaces = await pool.query(query, [amenityIds, amenityIds.length]);
            res.json(filteredSpaces.rows);
        }
        else {
            const allSpaces = await pool.query("SELECT * from spaces ORDER BY created_at DESC");
            res.json(allSpaces.rows);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

export const getSpaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const space = await pool.query("Select * from spaces where id=$1", [id]);

        if (space.rows.length == 0) {
            return res.status(404).json({ error: "Space not Found" });
        }
        res.json(space.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

export const getMySpaces = async (req, res) => {
    try {
        const userId = req.user.id;
        const mySpaces = await pool.query("Select * from spaces where owner_id = $1", [userId]);
        res.json(mySpaces.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

export const updateSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, address, price_per_day } = req.body;
        const userId = req.user.id;

        const spaceResult = await pool.query("SELECT * FROM spaces WHERE id = $1", [id]);

        if (spaceResult.rows.length === 0) {
            return res.status(404).json({ error: "Space not found" })
        }
        if (spaceResult.rows[0].owner_id !== userId) {
            return res.status(403).json({ error: "User not authorized to update this space" });
        }
        const updatedSpace = await pool.query(
            "UPDATE spaces SET name = $1, description = $2, address = $3, price_per_day = $4 WHERE id = $5 RETURNING *",
            [name, description, address, price_per_day, id]
        );
        res.json(updatedSpace.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

export const deleteSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const spaceResult = await pool.query("SELECT * FROM spaces WHERE id = $1", [id]);

        if (spaceResult.rows.length === 0) {
            return res.status(404).json({ error: "Space not found" });
        }

        if (spaceResult.rows[0].owner_id !== userId) {
            return res.status(403).json({ error: "User not authorized to delete this space" });
        }

        await pool.query("DELETE FROM spaces WHERE id = $1", [id]);

        res.json({ message: "Space deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const syncSpaceAmenities = async (req, res) => {
    try {
        const { id } = req.params;
        const { amenityIds } = req.body;
        const userId = req.user.id;

        const spaceResult = await pool.query("SELECT owner_id FROM spaces WHERE id = $1", [id]);
        if (spaceResult.rows.length === 0) return res.status(404).json({ error: "Space not found" });
        if (spaceResult.rows[0].owner_id !== userId) return res.status(403).json({ error: "User not authorized" });

        const client = await pool.connect();
        await client.query('BEGIN');
        await client.query("DELETE FROM space_amenities WHERE space_id = $1", [id]);

        for (const amenityId of amenityIds) {
            await client.query("INSERT INTO space_amenities (space_id, amenity_id) VALUES ($1, $2)", [id, amenityId]);
        }
        await client.query('COMMIT');
        client.release();

        res.json({ message: "Amenities updated successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        client.release();
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}