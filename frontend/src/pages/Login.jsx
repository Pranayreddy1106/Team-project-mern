import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-dark'>
      <form
        onSubmit={handleSubmit}
        className='bg-card p-10 rounded-3xl border border-border w-full max-w-[450px]'
      >
        <h1 className='text-4xl font-bold mb-2'>Welcome Back</h1>
        <p className='text-gray-400 mb-8'>Login to your EduFlow account</p>

        {error && (
          <div className='bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl mb-6'>
            {error}
          </div>
        )}

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              type='email'
              name='email'
              placeholder='you@example.com'
              required
              className='w-full bg-dark border border-border rounded-xl p-4 outline-none focus:border-primary transition'
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-sm font-semibold mb-2'>Password</label>
            <input
              type='password'
              name='password'
              placeholder='********'
              required
              className='w-full bg-dark border border-border rounded-xl p-4 outline-none focus:border-primary transition'
              onChange={handleChange}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-primary w-full py-4 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-gray-400'>
            Don't have an account?{' '}
            <Link to='/register' className='text-primary hover:underline font-semibold'>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
