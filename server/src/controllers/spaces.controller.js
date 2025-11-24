import Space from '../models/Space.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import cloudinary from '../config/cloudinary.config.js';
import { Buffer } from 'node:buffer';
import mongoose from 'mongoose';

const uploadToCloudinary = async (file) => {
  if (!file) return null;
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = "data:" + file.mimetype + ";base64," + b64;
  const result = await cloudinary.uploader.upload(dataURI, { folder: "coworking-spaces" });
  return result.secure_url;
};

export const createSpace = async (req, res) => {
  try {
    const { name, description, address, price_per_day, amenities } = req.body;
    const owner_id = new mongoose.Types.ObjectId(req.user.id);
    const imageUrl = await uploadToCloudinary(req.file);

    const newSpace = await Space.create({
        owner_id, 
        name,
        description,
        address,
        price_per_day: parseFloat(price_per_day),
        image_url: imageUrl,
        amenities: amenities || [] 
    });

    res.status(201).json(newSpace);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).send("Validation failed: All required fields must be present.");
    }
    res.status(500).send("Server error: " + err.message);
  }
};

export const getAllSpaces = async (req, res) => {
  try {
    const { amenities, page = 1, limit = 9, search } = req.query;
    
    let query = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
      ];
    }

    if (amenities) {
      const amenityIds = amenities.split(',');
      query.amenities = { $all: amenityIds };
    }

    const skip = (page - 1) * limit;

    const spaces = await Space.find(query)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Space.countDocuments(query);

    res.json({
      spaces,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).populate('amenities', 'name'); 
    
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }
    res.json(space);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: "Space not found due to invalid ID format." });
    }
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getMySpaces = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const mySpaces = await Space.find({ owner_id: userId }).sort({ created_at: -1 });
    res.json(mySpaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateSpace = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, description, address, price_per_day, amenities } = req.body;
    const userId = req.user.id;

    const space = await Space.findById(id);

    if (!space) return res.status(404).json({ error: "Space not found" });
    if (space.owner_id.toString() !== userId) {
      return res.status(403).json({ error: "User not authorized to update this space" });
    }

    let imageUrl = space.image_url;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const updatedSpace = await Space.findByIdAndUpdate(
        id, 
        { 
          name, 
          description, 
          address, 
          price_per_day: parseFloat(price_per_day), 
          image_url: imageUrl,
          amenities: amenities 
        },
        { new: true, runValidators: true } 
    );

    res.json(updatedSpace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const space = await Space.findById(id);

    if (!space) return res.status(404).json({ error: "Space not found" });
    if (space.owner_id.toString() !== userId) {
      return res.status(403).json({ error: "User not authorized to delete this space" });
    }

    await Booking.deleteMany({ space_id: id });

    await Review.deleteMany({ space_id: id });

    await Space.findByIdAndDelete(id); 

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

    const space = await Space.findById(id);
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    if (space.owner_id.toString() !== userId) {
      return res.status(403).json({ error: "User not authorized" });
    }

    for (const amenityId of amenityIds) {
      if (!mongoose.Types.ObjectId.isValid(amenityId)) {
        return res.status(400).json({ error: `Invalid amenity ID: ${amenityId}` });
      }
    }

    space.amenities = amenityIds;
    await space.save();

    res.json({
      message: "Amenities updated successfully",
      amenities: space.amenities
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
