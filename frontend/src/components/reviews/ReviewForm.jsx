import { useState } from 'react';
import reviewService from '../../services/reviewService';
import { FaStar } from 'react-icons/fa';

export default function ReviewForm({ courseId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) return setError('Please select a rating');
    if (!comment) return setError('Comment cannot be empty');
    setLoading(true);
    setError('');
    try {
      await reviewService.addReview({ courseId, rating, comment });
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4 text-black">Leave a Review</h3>
{error && <p className="text-red-500 mb-2">{error}</p>}
<p className="text-sm font-medium text-black mb-2">Rate this Lecture</p>
<div className="flex items-center space-x-2 mb-4">
{[1, 2, 3, 4, 5].map((star) => (

      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex items-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        className="w-full p-2 rounded border border-border bg-card text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        rows="4"
        placeholder="Write your comment..."
        style={{ color: 'black' }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-60 transition"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
