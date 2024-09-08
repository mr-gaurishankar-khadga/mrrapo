import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewPage = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [media, setMedia] = useState([]);
  const [error, setError] = useState('');

  // Fetch reviews when component loads
  useEffect(() => {
    axios.get(`/api/reviews/${productId}`)
      .then(response => setReviews(response.data))
      .catch(err => console.error(err));
  }, [productId]);

  // Handle media upload (multiple files)
  const handleMediaChange = (e) => {
    setMedia(Array.from(e.target.files)); 
  };

  // Submit a new review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError('Review text is required');
      return;
    }
    
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('reviewText', reviewText);
    media.forEach(file => formData.append('media', file));

    try {
      const response = await axios.post('/api/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReviews([response.data, ...reviews]); 
      setReviewText('');
      setMedia([]);
      setError('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Product Reviews</h2>

      <form onSubmit={submitReview}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          required
        ></textarea>

        <input type="file" onChange={handleMediaChange} multiple accept="image/*,video/*" />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Submit Review</button>
      </form>

      {/* Display all reviews */}
      <div className="reviews">
        {reviews.map(review => (
          <div key={review._id} className="review">
            <p>{review.reviewText}</p>

            {/* Display media (image/video) */}
            <div className="media-container">
              {review.media.map((mediaUrl, index) => (
                review.mediaType[index] === 'image' ? (
                  <img key={index} src={mediaUrl} alt="Review" width="200" />
                ) : (
                  <video key={index} src={mediaUrl} controls width="200"></video>
                )
              ))}
            </div>

            <small>Posted on {new Date(review.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
