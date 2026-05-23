import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/common/Navbar';
import courseService from '../services/courseService';
import lectureService from '../services/lectureService';
import quizService from '../services/quizService';
import userService from '../services/userService';
import ReviewList from '../components/reviews/ReviewList';
import { getEmbedUrl } from '../utils/video';

const emptyCourse = {
  title: '',
  description: '',
  category: '',
  difficulty: 'Beginner',
  thumbnail: '',
  price: '',
};

const emptyLecture = {
  title: '',
  videoUrl: '',
  description: '',
  isPreview: false,
};

const newQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
});

const icons = {
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  lectures: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [lectureForm, setLectureForm] = useState(emptyLecture);
  const [questions, setQuestions] = useState([newQuestion()]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Real instructor stats from backend
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalCertificates: 0,
    quizzesPassed: 0,
    averageQuizScore: 0,
    courseStats: [],
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === selectedCourseId),
    [courses, selectedCourseId]
  );

  useEffect(() => {
    loadCourses();
    loadInstructorStats();
  }, []);

  const loadCourses = async () => {
    try {
      const myCourses = await courseService.getMyCourses();
      setCourses(myCourses);
      setSelectedCourseId((current) => current || myCourses[0]?._id || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load instructor courses');
    } finally {
      setLoading(false);
    }
  };

  const loadInstructorStats = async () => {
    try {
      const data = await userService.getInstructorStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load instructor stats:', err);
    }
  };

  const showMessage = (text) => {
    setMessage(text);
    setError('');
  };

  const showError = (err, fallback) => {
    setError(err.response?.data?.message || fallback);
    setMessage('');
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const course = await courseService.createCourse({
        ...courseForm,
        price: Number(courseForm.price || 0),
      });
      setCourses((items) => [course, ...items]);
      setSelectedCourseId(course._id);
      setCourseForm(emptyCourse);
      showMessage('Course created successfully');
      loadInstructorStats();
    } catch (err) {
      showError(err, 'Unable to create course');
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      const lecture = await lectureService.addLecture(selectedCourseId, {
        ...lectureForm,
        resources: [],
      });

      setCourses((items) =>
        items.map((course) =>
          course._id === selectedCourseId
            ? { ...course, lectures: [...(course.lectures || []), lecture] }
            : course
        )
      );
      setLectureForm(emptyLecture);
      showMessage('Lecture added successfully');
    } catch (err) {
      showError(err, 'Unable to add lecture');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      await quizService.createQuiz(selectedCourseId, questions);
      setQuestions([newQuestion()]);
      showMessage('Quiz published successfully');
      loadInstructorStats();
    } catch (err) {
      showError(err, 'Unable to publish quiz');
    }
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((items) =>
      items.map((item, itemIndex) =>
        itemIndex === questionIndex
          ? {
              ...item,
              options: item.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
            }
          : item
      )
    );
  };

  const removeQuestion = (index) => {
    setQuestions((items) =>
      items.length === 1 ? items : items.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const previewUrl = getEmbedUrl(lectureForm.videoUrl);

  return (
    <div className="min-h-screen bg-dark text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      <div className='p-6 md:p-10 space-y-8 max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-border/30 pb-6'>
          <div>
            <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent'>
              Instructor Workspace
            </h1>
            <p className='text-gray-400 mt-2 text-sm md:text-base'>
              Create courses, add interactive video lessons, and publish course quizzes.
            </p>
          </div>
        </div>

        {/* Big Dashboard Stats Row */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          <Stat label='Courses' value={stats.totalCourses} icon={icons.courses} />
          <Stat label='Lectures' value={courses.reduce((sum, course) => sum + (course.lectures?.length || 0), 0)} icon={icons.lectures} />
          <Stat label='Students' value={stats.totalStudents} icon={icons.students} />
          <Stat label='Certificates' value={stats.totalCertificates} icon={icons.certificates} />
          <Stat label='Quizzes Passed' value={stats.quizzesPassed} icon={icons.quizzes} />
          <Stat label='Avg Score' value={`${stats.averageQuizScore}%`} icon={icons.score} />
        </div>

        {(message || error) && (
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

        {/* Per-Course Analytics */}
        {stats.courseStats.length > 0 && (
          <section className='bg-card/40 backdrop-blur-md rounded-3xl p-6 border border-border shadow-xl'>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className='text-2xl font-bold tracking-tight'>Course Analytics</h2>
            </div>
            <div className='overflow-x-auto rounded-2xl border border-border/40 bg-dark/20'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b border-border/40 bg-dark/40 text-gray-400 text-xs font-bold uppercase tracking-wider'>
                    <th className='p-4'>Course</th>
                    <th className='p-4 text-center'>Students</th>
                    <th className='p-4 text-center'>Quiz Attempts</th>
                    <th className='p-4 text-center'>Avg Score</th>
                    <th className='p-4 text-center'>Passed</th>
                    <th className='p-4 text-center'>Certified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {stats.courseStats.map((cs) => (
                    <tr key={cs.courseId} className='hover:bg-dark/40 transition-colors duration-200'>
                      <td className='p-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate'>{cs.title}</td>
                      <td className='p-4 text-center text-slate-700 dark:text-gray-300'>{cs.studentsEnrolled}</td>
                      <td className='p-4 text-center text-slate-700 dark:text-gray-300'>{cs.quizAttempts}</td>
                      <td className='p-4 text-center'>
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          cs.quizAttempts === 0
                            ? 'bg-gray-500/10 text-gray-400'
                            : cs.avgQuizScore >= 75
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : cs.avgQuizScore >= 50
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {cs.quizAttempts > 0 ? `${cs.avgQuizScore}%` : '—'}
                        </span>
                      </td>
                      <td className='p-4 text-center text-green-400 font-bold'>{cs.quizzesPassed}</td>
                      <td className='p-4 text-center text-primary font-bold'>{cs.certified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className='grid grid-cols-12 gap-8'>
          <section className='col-span-12 xl:col-span-4 bg-card/40 backdrop-blur-md rounded-3xl p-6 border border-border shadow-xl flex flex-col justify-between'>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className='text-2xl font-bold tracking-tight'>Create Course</h2>
              </div>
              <form onSubmit={handleCreateCourse} className='space-y-4'>
                <Input label='Title' value={courseForm.title} onChange={(value) => setCourseForm({ ...courseForm, title: value })} required />
                <Textarea label='Description' value={courseForm.description} onChange={(value) => setCourseForm({ ...courseForm, description: value })} />
                <Input label='Category' value={courseForm.category} onChange={(value) => setCourseForm({ ...courseForm, category: value })} placeholder='Enter category like Web Development' />
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide'>
                  Difficulty Level
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    className='mt-2 w-full bg-dark border border-border/80 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer font-medium text-sm'
                  >
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Advanced'>Advanced</option>
                  </select>
                </label>
                <Input label='Thumbnail URL' value={courseForm.thumbnail} onChange={(value) => setCourseForm({ ...courseForm, thumbnail: value })} />
                <Input label='Price (₹)' type='number' min='0' value={courseForm.price} onChange={(value) => setCourseForm({ ...courseForm, price: value })} required />
                <button className='w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-xl font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform active:scale-95'>
                  Create Course
                </button>
              </form>
            </div>
          </section>

          <section className='col-span-12 xl:col-span-8 bg-card/40 backdrop-blur-md rounded-3xl p-6 border border-border shadow-xl'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b border-border/30 pb-4'>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className='text-2xl font-bold tracking-tight'>Manage Content</h2>
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className='bg-dark border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer text-slate-900 dark:text-white font-semibold'
                disabled={loading || courses.length === 0}
              >
                <option value='' className="bg-card text-slate-900 dark:text-white">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id} className="bg-card text-slate-900 dark:text-white">
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {!selectedCourse ? (
              <div className='bg-dark/40 rounded-2xl border border-dashed border-border p-12 text-center text-gray-400 flex flex-col items-center justify-center space-y-3'>
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-base font-semibold">Create a course to start adding content</p>
                <p className="text-sm text-gray-500">Once you make a course, you can upload lectures and setup final course quizzes.</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='space-y-6'>
                  <div className='bg-dark/50 rounded-2xl border border-border/50 p-5 shadow-inner'>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{selectedCourse.title}</h3>
                    <p className='text-gray-400 mt-2 text-sm leading-relaxed'>{selectedCourse.description || 'No description yet.'}</p>
                  </div>

                  <form onSubmit={handleAddLecture} className='bg-dark/30 rounded-2xl border border-border/40 p-5 space-y-4'>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2'>
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Add Video Lecture
                    </h3>
                    <Input label='Lecture title' value={lectureForm.title} onChange={(value) => setLectureForm({ ...lectureForm, title: value })} required />
                    <Input label='Video link' value={lectureForm.videoUrl} onChange={(value) => setLectureForm({ ...lectureForm, videoUrl: value })} placeholder='https://youtu.be/...' required />
                    <Textarea label='Description' value={lectureForm.description} onChange={(value) => setLectureForm({ ...lectureForm, description: value })} />
                    <label className='flex items-center gap-3 text-sm text-gray-300 cursor-pointer select-none'>
                      <input
                        type='checkbox'
                        checked={lectureForm.isPreview}
                        onChange={(e) => setLectureForm({ ...lectureForm, isPreview: e.target.checked })}
                        className="rounded border-border bg-dark text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                      />
                      Allow preview before enrollment
                    </label>
                    {lectureForm.videoUrl && (
                      <div className='aspect-video rounded-2xl overflow-hidden border border-border bg-black shadow-lg shadow-black/45'>
                        <iframe
                          src={previewUrl}
                          title='Lecture preview'
                          className='w-full h-full'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </div>
                    )}
                    <button className='w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform active:scale-95'>
                      Add Lecture
                    </button>
                  </form>
                </div>

                <div className='space-y-6'>
                  <div className='bg-dark/50 rounded-2xl border border-border/50 p-5'>
                    <h3 className='text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2'>
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Course Lectures
                    </h3>
                    <div className='space-y-3 max-h-[220px] overflow-y-auto pr-1'>
                      {selectedCourse.lectures?.length ? (
                        selectedCourse.lectures.map((lecture) => (
                          <div key={lecture._id} className='border border-border/40 bg-dark/20 rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-colors duration-200'>
                            <div>
                              <p className='font-semibold text-sm text-slate-900 dark:text-white'>{lecture.title}</p>
                              <p className='text-xs text-gray-400 mt-0.5'>
                                {lecture.isPreview ? 'Preview enabled' : 'Enrolled students only'}
                              </p>
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full ${lecture.isPreview ? 'bg-green-400' : 'bg-primary'}`} />
                          </div>
                        ))
                      ) : (
                        <p className='text-sm text-gray-400'>No lectures added yet.</p>
                      )}
                    </div>
                  </div>
{/* Recent Reviews Section */}
<section className="col-span-12 xl:col-span-8 bg-card/40 backdrop-blur-md rounded-3xl p-6 border border-border shadow-xl mt-8">
  <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Recent Reviews</h2>
  <ReviewList courseId={selectedCourseId} />
</section>

                  <form onSubmit={handleCreateQuiz} className='bg-dark/30 rounded-2xl border border-border/40 p-5 space-y-5'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <h3 className='text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2'>
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Create Quiz
                        </h3>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          Add questions to the final course quiz.
                        </p>
                      </div>
                      <button
                        type='button'
                        onClick={() => setQuestions([...questions, newQuestion()])}
                        className='px-3 py-1.5 border border-border/80 rounded-xl text-xs font-semibold hover:border-primary hover:bg-primary/5 transition-all duration-200'
                      >
                        + Add Question
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {questions.map((item, index) => (
                        <div key={index} className='border border-border/60 bg-dark/20 rounded-xl p-4 space-y-3 relative group'>
                          <div className='flex items-center justify-between gap-3'>
                            <p className='text-sm font-bold text-slate-900 dark:text-white'>Question {index + 1}</p>
                            {questions.length > 1 && (
                              <button
                                type='button'
                                onClick={() => removeQuestion(index)}
                                className='text-xs text-red-400 hover:text-red-300 transition-colors duration-200'
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <Input label='Question text' value={item.question} onChange={(value) => updateQuestion(index, 'question', value)} required />
                          <div className="grid grid-cols-2 gap-2">
                            {item.options.map((option, optionIndex) => (
                              <Input
                                key={optionIndex}
                                label={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(value) => updateOption(index, optionIndex, value)}
                                required
                              />
                            ))}
                          </div>
                          <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide'>
                            Correct answer
                            <select
                              value={item.correctAnswer}
                              onChange={(e) => updateQuestion(index, 'correctAnswer', Number(e.target.value))}
                              className='mt-2 w-full bg-card border border-border/80 rounded-xl p-3 outline-none focus:border-primary transition-all duration-200 text-slate-900 dark:text-white cursor-pointer'
                            >
                              {[0, 1, 2, 3].map((value) => (
                                <option key={value} value={value} className="bg-card text-slate-900 dark:text-white">
                                  Option {value + 1}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      ))}
                    </div>

                    <button className='w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform active:scale-95'>
                      Publish Quiz
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide'>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='mt-2 w-full bg-dark border border-border/80 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 normal-case'
        {...props}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, ...props }) {
  return (
    <label className='block text-xs font-bold text-gray-400 uppercase tracking-wide'>
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows='3'
        className='mt-2 w-full bg-dark border border-border/80 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none normal-case'
        {...props}
      />
    </label>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className='bg-card/45 backdrop-blur-md rounded-2xl p-5 border border-border/60 shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 flex items-center justify-between group'>
      <div className='space-y-1.5'>
        <p className='text-gray-400 text-xs font-bold uppercase tracking-wider'>{label}</p>
        <p className='text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300'>{value}</p>
      </div>
      <div className='p-2.5 bg-dark/50 rounded-xl text-primary group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 flex-shrink-0'>
        {icon}
      </div>
    </div>
  );
}
