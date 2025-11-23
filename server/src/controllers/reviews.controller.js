import Review from '../models/Review.js';
import Space from '../models/Space.js';
import mongoose from 'mongoose';

export const submitReview = async (req, res) => {
  try {
    const { spaceId, rating, comment } = req.body;
    const user_id = req.user.id; 

    const spaceExists = await Space.findById(spaceId);
    if (!spaceExists) {
      return res.status(404).json({ error: 'Space not found.' });
    }

    const existingReview = await Review.findOne({ space_id: spaceId, user_id: user_id });
    if (existingReview) {
      return res.status(409).json({ error: 'You have already submitted a review for this space.' });
    }

    const newReview = await Review.create({
      space_id: spaceId,
      user_id: user_id,
      rating: rating,
      comment: comment || ''
    });

    res.status(201).json(newReview);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
};

export const getReviewsBySpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const reviews = await Review.find({ space_id: spaceId })
      .sort({ created_at: -1 })
      .populate({
        path: 'user_id',
        select: 'username email'
      });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
};