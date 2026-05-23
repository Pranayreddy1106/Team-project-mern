import { useEffect, useState } from 'react';
import reviewService from '../../services/reviewService';
import { FaStar } from 'react-icons/fa';

export default function ReviewList({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getCourseReviews(courseId);
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviews();
  }, [courseId]);

  if (loading) return <p className="text-gray-400">Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reviews.length) return <p className="text-gray-400">No reviews yet.</p>;

  return (
    <div className="space-y-4 mt-8">
      {reviews.map((rev) => (
        <div key={rev._id} className="p-4 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-sm ${star <= rev.rating ? 'text-yellow-400' : 'text-gray-400'}`}
              />
            ))}
          </div>
          <p className="text-gray-200 mb-1">{rev.comment}</p>
          <p className="text-xs text-gray-500">by {rev.userId?.name || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  );
}
