import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import courseService from '../services/courseService';
import paymentService from '../services/paymentService';

export default function PaymentPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load course');
      }
    };

    loadCourse();
  }, [courseId]);

  const completePayment = async () => {
    setLoading(true);
    setError('');
    try {
      await paymentService.createPayment(courseId);
      setMessage('Payment complete and enrollment successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className='min-h-[calc(100vh-80px)] flex items-center justify-center p-6 md:p-10'>
        <div className='max-w-2xl w-full bg-card rounded-3xl p-8 md:p-10 border border-border'>
          <h1 className='text-3xl md:text-4xl font-bold mb-8'>Complete Your Purchase</h1>

          {(error || message) && (
            <div
              className={`rounded-2xl border p-4 mb-8 ${
                error
                  ? 'bg-red-500/15 border-red-500 text-red-300'
                  : 'bg-green-500/15 border-green-500 text-green-300'
              }`}
            >
              {error || message}
            </div>
          )}

          <div className='bg-dark rounded-2xl p-6 border border-border mb-8'>
            <div className='flex justify-between mb-4'>
              <span className='text-gray-400'>{course?.title || 'Course'}</span>
              <span className='font-bold'>${course?.price || 0}</span>
            </div>
            <div className='border-t border-border pt-4 flex justify-between text-xl font-bold'>
              <span>Total</span>
              <span className='text-primary'>${course?.price || 0}</span>
            </div>
          </div>

          <button
            onClick={completePayment}
            disabled={loading || Boolean(message)}
            className='bg-primary w-full py-4 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60'
          >
            {loading ? 'Processing...' : message ? 'Completed' : 'Complete Payment'}
          </button>

          {message && (
            <Link
              to={`/courses/${courseId}`}
              className='block text-center border border-border w-full py-4 rounded-xl font-semibold hover:border-primary transition mt-4'
            >
              Back to Course
            </Link>
          )}

          <p className='text-center text-gray-400 text-sm mt-4'>
            Demo payment uses the backend paid-enrollment route.
          </p>
        </div>
      </div>
    </div>
  );
}
