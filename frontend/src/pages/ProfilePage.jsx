import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import userService from '../services/userService';

const icons = {
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  students: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  certificates: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  quizzes: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  score: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
};

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', role: '', bio: '', avatar: '' });
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [myProfile, myStats] = await Promise.all([
          userService.getMyProfile(),
          userService.getMyStats(),
        ]);
        setProfile({
          name: myProfile.name || '',
          email: myProfile.email || '',
          role: myProfile.role || '',
          bio: myProfile.bio || '',
          avatar: myProfile.avatar || '',
        });
        setStats(myStats);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile');
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await userService.updateMyProfile({
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
      });
      setProfile((current) => ({ ...current, ...updated }));
      setMessage('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      <div className='p-6 md:p-10 max-w-5xl mx-auto'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent'>
            My Profile
          </h1>

          {(error || message) && (
            <div
              className={`rounded-2xl border p-4 shadow-xl transition-all duration-300 ${
                error
                  ? 'bg-red-500/10 border-red-500/30 text-red-300 shadow-red-500/5'
                  : 'bg-green-500/10 border-green-500/30 text-green-300 shadow-green-500/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {error ? (
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-sm font-semibold">{error || message}</span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <form onSubmit={saveProfile} className='bg-card/40 backdrop-blur-md rounded-3xl p-8 border border-border shadow-xl'>
                <h2 className='text-2xl font-bold tracking-tight mb-6 flex items-center gap-2'>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>

                <div className='space-y-6'>
                  <Field label='Full Name' value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label='Email' value={profile.email} readOnly />
                    <Field label='Role' value={profile.role} readOnly />
                  </div>
                  <Field label='Avatar URL' value={profile.avatar} onChange={(value) => setProfile({ ...profile, avatar: value })} />
                  <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide'>
                    <span className="mb-2 block">Bio</span>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows='4'
                      className='w-full bg-dark border border-border/80 rounded-xl p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white transition-all duration-200 resize-none normal-case'
                    />
                  </label>

                  <button className='w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform active:scale-95 text-white'>
                    Save Profile
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className='bg-card/40 backdrop-blur-md rounded-3xl p-6 border border-border shadow-xl'>
                <h2 className='text-2xl font-bold tracking-tight mb-6 flex items-center gap-2'>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Account Stats
                </h2>

                <div className='space-y-4'>
                  <Stat label={profile.role === 'instructor' ? 'Courses Created' : 'Courses Enrolled'} value={stats.totalCoursesEnrolled || 0} icon={icons.courses} />
                  {profile.role === 'instructor' && (
                    <Stat label='Total Students' value={stats.totalStudents || 0} icon={icons.students} />
                  )}
                  <Stat label='Certificates' value={stats.totalCertificates || 0} icon={icons.certificates} />
                  <Stat label='Quizzes Passed' value={stats.quizzesPassed || 0} icon={icons.quizzes} />
                  <Stat label='Average Score' value={`${stats.averageQuizScore || 0}%`} icon={icons.score} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, readOnly = false }) {
  return (
    <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide'>
      <span className="mb-2 block">{label}</span>
      <input
        type='text'
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-dark border border-border/80 rounded-xl p-4 text-slate-900 dark:text-white outline-none transition-all duration-200 normal-case ${
          readOnly ? 'opacity-60 cursor-not-allowed border-dashed' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
        }`}
      />
    </label>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className='bg-dark/50 p-4.5 rounded-2xl border border-border/50 flex items-center justify-between group hover:border-primary/30 transition-all duration-300'>
      <div>
        <p className='text-gray-400 text-xs font-bold uppercase tracking-wider'>{label}</p>
        <p className='text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 mt-1.5'>{value}</p>
      </div>
      <div className='p-2 bg-dark/70 rounded-xl text-primary group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 flex-shrink-0'>
        {icon}
      </div>
    </div>
  );
}
