import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import courseService from '../services/courseService';
import paymentService from '../services/paymentService';
import progressService from '../services/progressService';
import { AuthContext } from '../context/AuthContext';
import { FaPlay, FaStar, FaLock } from 'react-icons/fa';
import { formatDuration } from '../utils/video';
import certificateService from '../services/certificateService';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(null); // { percentage, completed, total }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await courseService.getCourseById(id);
        setCourse(courseData);

        if (user?.role === 'student') {
          const isEnrolled = await courseService.checkEnrollment(id);
          setEnrolled(isEnrolled);
          if (isEnrolled) {
            try {
              const prog = await progressService.getProgressPercentage(id);
              setProgress(prog);
            } catch (err) {
              console.error('Error fetching progress percentage', err);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Course not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user?.role]);

  const isInstructorOwner = useMemo(() => {
    const instructorId = course?.instructor?._id || course?.instructor;
    return user?.role === 'instructor' && instructorId === user?.id;
  }, [course, user]);

  const isQuizLocked = useMemo(() => {
    if (user?.role !== 'student') return false;
    if (!progress) return true; // Default lock until loaded
    return progress.total > 0 && progress.completed < progress.total;
  }, [progress, user]);

  const allLecturesWatched = useMemo(() => {
    if (!progress) return false;
    return progress.total > 0 && progress.completed === progress.total;
  }, [progress]);

  const quizPassed = useMemo(() => {
    return !!(progress && progress.quizPassed);
  }, [progress]);

  const isCompleted = useMemo(() => {
    return allLecturesWatched && quizPassed;
  }, [allLecturesWatched, quizPassed]);

  const canWatch = enrolled || isInstructorOwner || user?.role === 'admin';

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }

    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      if (Number(course.price) > 0) {
        await paymentService.createPayment(course._id);
      } else {
        await courseService.enrollCourse(course._id);
      }
      setEnrolled(true);
      setMessage('Enrollment successful. You can start learning now.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to enroll');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
  try {
    const cert = await certificateService.generateCertificate(id);
    alert('Certificate generated! ID: ' + cert.certificateId);
  } catch (err) {
    const msg = err.response?.data?.message || 'Unable to generate certificate';
    alert(msg);
  }
};

if (loading) return <Loading />;

  if (!course) {
    return (
      <div>
        <Navbar />
        <div className='min-h-screen flex items-center justify-center'>
          <p className='text-2xl text-gray-400'>{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  const students = Array.isArray(course.students) ? course.students.length : course.students || 0;
  const firstLecture = course.lectures?.[0]?._id;

  return (
    <div>
      <Navbar />

      <div className='w-full h-80 md:h-96 bg-card'>
        <img
          src={course.thumbnail || 'https://via.placeholder.com/1200x500?text=Course'}
          alt={course.title}
          className='w-full h-full object-cover'
        />
      </div>

      <div className='px-6 md:px-10 lg:px-20 py-12'>
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

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-5xl font-bold mb-4'>{course.title}</h1>

            <div className='flex flex-wrap items-center gap-6 mb-8'>
              <div className='flex items-center gap-2'>
                <FaStar className='text-yellow-400' />
                <span>{course.averageRating || 'New'}</span>
              </div>
              <span className='text-gray-400'>{students} students</span>
              <span className='text-gray-400'>{course.category || 'General'}</span>
            </div>

            <p className='text-xl text-gray-300 mb-8'>{course.description}</p>

            <div className='bg-card rounded-3xl p-8 border border-border'>
              <div className='flex items-center justify-between gap-4 mb-6'>
                <h2 className='text-2xl font-bold'>Course Content</h2>
                {canWatch && (
                  isQuizLocked ? (
                    <span className='text-gray-500 font-semibold flex items-center gap-1.5 cursor-not-allowed' title="Complete all lectures to unlock the quiz.">
                      <FaLock className="w-3.5 h-3.5 text-gray-500" />
                      Open Quiz <span className="text-xs font-normal text-gray-500">(Locked)</span>
                    </span>
                  ) : (
                    <Link to={`/quiz/${course._id}`} className='text-primary font-semibold hover:text-purple-400 transition-colors duration-200'>
                      Open Quiz
                    </Link>
                  )
                )}
              </div>

              <div className='space-y-4'>
                {course.lectures?.length ? (
                  course.lectures.map((lecture) => {
                    const isAvailable = canWatch || lecture.isPreview;
                    const content = (
                      <div className='bg-dark p-4 rounded-xl border border-border hover:border-primary transition flex items-center gap-4'>
                        <FaPlay className='text-primary' />
                        <div className='flex-1'>
                          <p className='font-semibold'>{lecture.title}</p>
                          <p className='text-sm text-gray-400'>
                            {formatDuration(lecture.duration)}
                            {lecture.isPreview ? ' · Preview' : ''}
                          </p>
                        </div>
                      </div>
                    );

                    return isAvailable ? (
                      <Link
                        key={lecture._id}
                        to={`/courses/${course._id}/lectures/${lecture._id}`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={lecture._id} className='opacity-60'>
                        {content}
                      </div>
                    );
                  })
                ) : (
                  <p className='text-gray-400'>No lectures available yet</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className='bg-card rounded-3xl p-8 border border-border sticky top-24'>
              <p className='text-4xl font-bold mb-6 text-primary'>
                {course.price ? `$${course.price}` : 'Free'}
              </p>

              {canWatch ? (
                <div className='space-y-4'>
                  {user?.role === 'student' && (
                    <>
                      {/* 1. Fully Completed State */}
                      {isCompleted && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center space-y-4 shadow-lg shadow-green-500/5 mb-4">
                          <div className="flex items-center justify-center gap-2 text-green-400 font-extrabold text-lg uppercase tracking-wider">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                            </svg>
                            Course Completed!
                          </div>
                          <button
                            onClick={handleGenerateCertificate}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download Certificate
                          </button>
                        </div>
                      )}

                      {/* 2. All Lectures Watched but Quiz NOT Passed */}
                      {allLecturesWatched && !quizPassed && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 text-center space-y-4 shadow-lg shadow-yellow-500/5 mb-4">
                          <div className="flex flex-col gap-1 items-center">
                            <span className="text-yellow-400 font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                              <FaLock className="w-3.5 h-3.5 text-yellow-400" />
                              Quiz Pending
                            </span>
                            <span className="text-gray-400 text-xs font-semibold">
                              Complete Quiz to Finish Course
                            </span>
                          </div>
                          <Link
                            to={firstLecture ? `/courses/${course._id}/lectures/${firstLecture}` : '#'}
                            className="block text-center bg-dark border border-border/85 hover:border-primary py-3.5 rounded-xl font-bold text-slate-800 dark:text-white transition duration-200"
                          >
                            Review Course
                          </Link>
                          <Link
                            to={`/quiz/${course._id}`}
                            className="block text-center bg-primary hover:bg-purple-700 py-3.5 rounded-xl font-bold text-white transition duration-200"
                          >
                            Take Final Quiz
                          </Link>
                        </div>
                      )}

                      {/* 3. In Progress (not all lectures watched) */}
                      {!allLecturesWatched && (
                        <Link
                          to={firstLecture ? `/courses/${course._id}/lectures/${firstLecture}` : '#'}
                          className='block text-center bg-primary w-full py-4 rounded-xl font-semibold hover:bg-purple-700 transition mb-4'
                        >
                          {progress && progress.completed > 0 ? 'Resume Learning' : 'Start Learning'}
                        </Link>
                      )}
                    </>
                  )}
                  <Link
                    to={`/chat/${course._id}`}
                    className='block text-center bg-dark border border-primary text-primary w-full py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition'
                  >
                    Join Course Chat
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={actionLoading}
                  className='bg-primary w-full py-4 rounded-xl font-semibold hover:bg-purple-700 transition mb-4 disabled:opacity-60'
                >
                  {actionLoading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <div className='mt-8 space-y-4'>
                <div>
                  <p className='text-sm text-gray-400'>Instructor</p>
                  <p className='font-semibold'>{course.instructor?.name || 'Unknown'}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Lectures</p>
                  <p className='font-semibold'>{course.lectures?.length || 0}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Category</p>
                  <p className='font-semibold capitalize'>{course.category || 'General'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
