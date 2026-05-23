import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaRegCheckCircle, FaTrophy, FaCertificate } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import courseService from '../services/courseService';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const items = await courseService.getAllCourses();
        setCourses(items);
      } catch {
        setCourses([]);
      }
    };
    loadCourses();
  }, []);

  const stats = useMemo(() => {
    const instructors = new Set(
      courses.map((course) => course.instructor?._id || course.instructor).filter(Boolean)
    );
    const categories = new Set(courses.map((course) => course.category).filter(Boolean));
    const lectures = courses.reduce((total, course) => total + (course.lectures?.length || 0), 0);

    return [
      { label: 'Courses Created', value: courses.length },
      { label: 'Top Instructors', value: instructors.size },
      { label: 'Specialized Categories', value: categories.size },
      { label: 'Interactive Lessons', value: lectures },
    ];
  }, [courses]);

  const featuredCourses = courses.slice(0, 3);
  const primaryLink = user ? '/dashboard' : '/register';
  const primaryText = user ? 'Open Dashboard' : 'Get Started';

  return (
    <div className="min-h-screen bg-dark text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      <main className="space-y-16 pb-20">
        {/* Hero Section */}
        <section className='px-6 md:px-10 lg:px-20 py-16 md:py-24 bg-gradient-to-r from-primary to-purple-600 text-white relative overflow-hidden'>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
          <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10'>
            <div className='lg:col-span-7 max-w-3xl space-y-6'>
              <span className='inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md uppercase tracking-wider'>
                EduFlow — The Ultimate Online Learning Platform
              </span>
                <h1 className='text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white'>
  Learn new skills through interactive courses.
  <br />
  Teach with simple and powerful tools.
 </h1>
<p className='text-gray-100 text-base md:text-lg leading-relaxed max-w-2xl'>
  Explore engaging courses, watch video lectures, complete quizzes, track your progress, and earn certificates upon successful course completion.
</p>

              <div className='flex flex-wrap gap-4 pt-4'>
                <Link
                  to={primaryLink}
                  className='inline-flex justify-center rounded-xl bg-white text-indigo-600 px-7 py-3.5 font-bold shadow-lg shadow-black/10 hover:shadow-black/20 hover:bg-gray-50 transition transform active:scale-95'
                >
                  {primaryText}
                </Link>
                <Link
                  to='/courses'
                  className='inline-flex justify-center rounded-xl border border-white/30 text-white px-7 py-3.5 font-bold hover:bg-white/10 hover:border-white/50 transition transform active:scale-95'
                >
                  Browse Courses
                </Link>
              </div>
            </div>

            <div className='lg:col-span-5'>
              <div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl shadow-black/20 border-border/20 dark:bg-card/45 dark:border-border/60'>
                <div className='aspect-video rounded-2xl bg-black/45 border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-inner'>
                  <div className='absolute inset-0 bg-cover bg-center filter blur-[1px] opacity-45' style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&auto=format&fit=crop&q=80')` }} />
                  <div className='grid h-14 w-14 place-items-center rounded-full bg-white text-primary shadow-lg shadow-primary/20 transform group-hover:scale-110 transition duration-300 z-10 cursor-pointer'>
                    <FaPlay className="ml-1" />
                  </div>
                </div>
                <div className='mt-6 space-y-3.5'>
                  {(featuredCourses.length ? featuredCourses : [{ title: 'Create your first course', category: 'Instructor' }]).map((course) => (
                    <Link
                      key={course._id || course.title}
                      to={course._id ? `/courses/${course._id}` : '/dashboard'}
                      className='flex items-center justify-between rounded-xl border border-white/10 bg-white/10 p-4 hover:bg-white/15 hover:border-white/20 transition duration-200 text-white'
                    >
                      <div>
                        <p className='font-bold text-sm text-white'>{course.title}</p>
                        <p className='text-xs text-white/70 mt-1'>
                          {course.category || 'No category yet'}
                        </p>
                      </div>
                      <FaRegCheckCircle className='text-white/80 shrink-0 ml-2' />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className='px-6 md:px-10 lg:px-20 max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((item) => (
              <div key={item.label} className='rounded-2xl border border-border/80 bg-card/65 backdrop-blur-sm p-6 shadow-md hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group'>
                <p className='text-4xl font-extrabold text-primary group-hover:scale-105 transform origin-left transition duration-300'>{item.value}</p>
                <p className='text-gray-400 font-bold text-xs uppercase tracking-wider mt-2.5 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-200'>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Grid */}
        <section className='px-6 md:px-10 lg:px-20 max-w-7xl mx-auto py-8 border-t border-border/30 space-y-12'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <h2 className='text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent'>
                One workflow, two roles
              </h2>
              <p className='text-gray-400 mt-2.5 max-w-2xl text-sm md:text-base'>
                Students and instructors now use tailored, beautiful interfaces built around fully integrated APIs.
              </p>
            </div>
            <Link to='/courses' className='inline-flex items-center gap-1.5 text-primary font-bold hover:text-purple-600 transition-colors group'>
              View all courses
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Feature
              icon={<FaPlay />}
              title='Video lessons'
              text='Instructors paste any video URL and students watch it directly inside a beautiful, embedded lecture page.'
            />
            <Feature
              icon={<FaTrophy />}
              title='Course quizzes'
              text='Each course features one custom final quiz with multiple choices and instant automatic scoring.'
            />
            <Feature
              icon={<FaCertificate />}
              title='Certificates'
              text='Completed courses generate official certificates that immediately appear in the student certificate gallery.'
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className='rounded-3xl border border-border/80 bg-card/65 backdrop-blur-sm p-8 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between space-y-4'>
      <div>
        <div className='mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300'>
          {icon}
        </div>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200'>{title}</h3>
        <p className='text-gray-400 mt-3 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-200'>{text}</p>
      </div>
    </div>
  );
}
