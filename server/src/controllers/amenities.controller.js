import Amenity from '../models/Amenity.js';
import Space from '../models/Space.js';
import mongoose from 'mongoose';

export const getAllAmenities = async (req, res) => {
  try {
    const allAmenities = await Amenity.find({}).sort({ name: 1 });
    res.json(allAmenities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

export const getAmenitiesForSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findById(spaceId)
      .populate('amenities'); 
    
    if (!space) {
      return res.status(404).json({ error: "Space not found." });
    }
    res.json(space.amenities); 

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: "Invalid Space ID format." });
    }
    console.error(err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

export const deleteAmenity = async (req, res) => {
    res.status(501).json({ error: "Not Implemented." });
};