// ReviewComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ReviewComponent = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('review', review);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/api/reviews', formData); 
      alert('Review submitted!');
      setRating(0);
      setReview('');
      setFile(null);
    } catch (err) {
      alert('Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4" style={{maxWidth: '500px'}}>
      <div className="mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Write your review..."
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*,video/*"
        className="my-4"
      />

      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewComponent;