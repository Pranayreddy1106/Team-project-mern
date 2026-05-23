import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div>
      <Navbar />

      <div className='min-h-[calc(100vh-80px)] flex items-center justify-center px-4'>
        <div className='text-center max-w-2xl'>
          <h1 className='text-9xl font-bold text-primary mb-4'>404</h1>
          <h2 className='text-5xl font-bold mb-4'>Page Not Found</h2>
          <p className='text-xl text-gray-400 mb-10'>
            Oops! The page you're looking for doesn't exist. Let's get you back on track.
          </p>

          <div className='flex gap-4 justify-center'>
            <Link
              to='/'
              className='bg-primary px-8 py-4 rounded-2xl font-semibold hover:bg-purple-700 transition flex items-center gap-2'
            >
              <FaHome /> Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className='border border-border px-8 py-4 rounded-2xl hover:border-primary transition flex items-center gap-2'
            >
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}