import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import userService from '../../services/userService';
import progressService from '../../services/progressService';

const icons = {
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    totalCoursesEnrolled: 0,
    totalCertificates: 0,
    averageQuizScore: 0,
    totalQuizzesAttempted: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [myCourses, myStats, myProgress] = await Promise.all([
          courseService.getMyCourses(),
          userService.getMyStats(),
          progressService.getAllProgress(),
        ]);

        setCourses(myCourses);
        setStats(myStats);
        setProgress(myProgress);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
      }
    };

    loadDashboard();
  }, []);

  const progressFor = (courseId) => {
    const item = progress.find((entry) => {
      const id = entry.courseId?._id || entry.courseId;
      return id === courseId;
    });

    if (!item) return 0;
    const completed = item.completedLectures?.length || 0;
    const total = courses.find((course) => course._id === courseId)?.lectures?.length || completed;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className='grid grid-cols-12 gap-8'>
      {error && (
        <div className='col-span-12 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 shadow-lg shadow-red-500/5'>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-semibold">{error}</span>
          </div>
        </div>
      )}

      <div className='col-span-12 lg:col-span-8 bg-card/45 backdrop-blur-md rounded-3xl p-8 border border-border shadow-xl'>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className='text-2xl font-bold tracking-tight'>Continue Learning</h2>
        </div>

        {courses.length === 0 ? (
          <div className='bg-dark/40 rounded-2xl border border-dashed border-border p-12 text-center text-gray-400 flex flex-col items-center justify-center space-y-4'>
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className='font-semibold text-base'>You have not enrolled in a course yet.</p>
            <Link to='/courses' className='inline-flex bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/45 transition-all duration-300 transform active:scale-95 text-white'>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {courses.map((course) => {
              const percent = progressFor(course._id);
              const firstLecture = course.lectures?.[0]?._id;

              return (
                <div key={course._id} className='bg-dark/50 rounded-2xl p-4.5 border border-border/80 hover:border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col justify-between'>
                  <div>
                    <div className="overflow-hidden rounded-xl mb-4 relative aspect-video">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&auto=format&fit=crop&q=80'}
                        alt={course.title}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60" />
                    </div>
                    <h3 className='font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-1'>{course.title}</h3>
                    <div className='mt-5 bg-card/60 h-2.5 rounded-full overflow-hidden border border-border/40 p-[2px] shadow-inner'>
                      <div className='bg-gradient-to-r from-primary to-purple-500 h-full rounded-full transition-all duration-500' style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-5 text-sm'>
                    <span className='text-gray-400 font-medium'>{percent}% complete</span>
                    <Link
                      to={
                        firstLecture
                          ? `/courses/${course._id}/lectures/${firstLecture}`
                          : `/courses/${course._id}`
                      }
                      className='inline-flex items-center gap-1.5 text-primary font-bold hover:text-purple-400 transition-colors duration-200 group/link'
                    >
                      {percent === 100 ? 'Completed' : 'Resume'}
                      <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className='col-span-12 lg:col-span-4 bg-card/45 backdrop-blur-md rounded-3xl p-8 border border-border shadow-xl flex flex-col justify-between'>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className='text-2xl font-bold tracking-tight'>Your Stats</h2>
          </div>

          <div className='space-y-4'>
            <Stat label='Courses Enrolled' value={stats.totalCoursesEnrolled || courses.length} icon={icons.courses} />
            <Stat label='Certificates Earned' value={stats.totalCertificates || 0} icon={icons.certificates} />
            <Stat label='Quizzes Attempted' value={stats.totalQuizzesAttempted || 0} icon={icons.quizzes} />
            <Stat label='Average Score' value={`${stats.averageQuizScore || 0}%`} icon={icons.score} />
          </div>
        </div>

        <Link
          to='/certificates'
          className='mt-8 block text-center bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/45 transition-all duration-300 transform active:scale-95 text-white'
        >
          View Certificates
        </Link>
      </div>
    </div>
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
