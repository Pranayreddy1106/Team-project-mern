import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import userService from '../services/userService';
import Loading from '../components/common/Loading';
import { FaUserCircle } from 'react-icons/fa';

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getPublicProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) return <Loading />;

  if (error || !profile) {
    return (
      <div>
        <Navbar />
        <div className='min-h-[70vh] flex items-center justify-center'>
          <p className='text-2xl text-gray-400'>{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='max-w-4xl mx-auto px-6 py-12 md:py-20'>
        <div className='bg-card rounded-[2.5rem] p-10 md:p-16 border border-border relative overflow-hidden'>
          {/* Decorative background element */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl'></div>
          
          <div className='flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10'>
            <div className='shrink-0'>
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className='w-32 h-32 md:w-44 md:h-44 rounded-3xl object-cover border-4 border-border shadow-2xl'
                />
              ) : (
                <div className='w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-dark border-4 border-border shadow-2xl flex items-center justify-center text-primary'>
                  <FaUserCircle size={80} />
                </div>
              )}
            </div>

            <div className='flex-1 text-center md:text-left'>
              <div className='inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 capitalize'>
                {profile.role}
              </div>
              <h1 className='text-4xl md:text-6xl font-bold mb-4 tracking-tight'>{profile.name}</h1>
              <p className='text-gray-400 text-lg mb-8 leading-relaxed max-w-xl'>
                {profile.bio || "This user hasn't added a bio yet."}
              </p>

              <div className='grid grid-cols-2 gap-4 md:gap-8 max-w-sm mx-auto md:mx-0'>
                <div className='bg-dark/50 p-6 rounded-3xl border border-border/50'>
                  <p className='text-gray-500 text-xs uppercase tracking-widest font-bold mb-1'>Member Since</p>
                  <p className='text-xl font-semibold'>
                    {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className='bg-dark/50 p-6 rounded-3xl border border-border/50'>
                  <p className='text-gray-500 text-xs uppercase tracking-widest font-bold mb-1'>Verified</p>
                  <p className='text-xl font-semibold text-green-500'>Yes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
