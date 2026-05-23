import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import lectureService from '../services/lectureService';
import reviewService from '../services/reviewService';
import progressService from '../services/progressService';
import { formatDuration, getEmbedUrl } from '../utils/video';
import { AuthContext } from '../context/AuthContext';


export default function LectureView() {
  const { courseId, id } = useParams();
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(null); // { percentage, completed, total }

  const fetchProgress = async () => {
    if (user?.role === 'student' && courseId) {
      try {
        const prog = await progressService.getProgressPercentage(courseId);
        setProgress(prog);
      } catch (err) {
        console.error('Error loading progress:', err);
      }
    }
  };

  useEffect(() => {
    const loadLectures = async () => {
      if (!courseId) {
        setError('Open this lecture from a course page so the course context is available.');
        setLoading(false);
        return;
      }

      try {
        const items = await lectureService.getLectures(courseId);
        setLectures(items);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load lecture');
      } finally {
        setLoading(false);
      }
    };

    loadLectures();
  }, [courseId]);

  useEffect(() => {
    fetchProgress();
  }, [courseId, user?.role, lectures]);

  const activeLecture = useMemo(
    () => lectures.find((lecture) => lecture._id === id) || lectures[0],
    [lectures, id]
  );

  const markComplete = async () => {
    if (!activeLecture) return;

    try {
      const result = await progressService.updateProgress({
        courseId,
        lectureId: activeLecture._id,
        timestamp: 0,
      });
      setMessage(
        result.certificate
          ? 'Course complete. Your certificate is ready in Certificates.'
          : 'Progress updated'
      );
      setError('');
      fetchProgress(); // Dynamically update progress
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update progress');
      setMessage('');
    }
  };



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

  const youtubeMatch = useMemo(() => {
    if (!activeLecture?.videoUrl) return null;
    return activeLecture.videoUrl.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ \s]{11})/
    );
  }, [activeLecture]);

  const isDirectVideo = useMemo(() => {
    const url = activeLecture?.videoUrl || '';
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.includes('/uploads/');
  }, [activeLecture]);

  useEffect(() => {
    if (!youtubeMatch || !activeLecture) return;

    let player;
    let checkYTInterval;

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        player = new window.YT.Player('youtube-video-player', {
          events: {
            onStateChange: (event) => {
              if (event.data === 0) { // Ended
                markComplete();
              }
            },
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      checkYTInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
          clearInterval(checkYTInterval);
        }
      }, 500);
    } else {
      const timer = setTimeout(initPlayer, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (checkYTInterval) clearInterval(checkYTInterval);
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [activeLecture, youtubeMatch]);

  if (loading) return <Loading />;

  if (!activeLecture) {
    return (
      <div>
        <Navbar />
        <div className='min-h-screen flex items-center justify-center px-6 text-center'>
          <p className='text-2xl text-gray-400'>{error || 'Lecture not found'}</p>
        </div>
      </div>
    );
  }

  const videoUrl = activeLecture.embedUrl || getEmbedUrl(activeLecture.videoUrl);

  return (
    <div>
      <Navbar />

      <div className='grid grid-cols-12 gap-6 p-6'>
        <div className='col-span-12 lg:col-span-9'>
          {(error || message) && (
            <div
              className={`rounded-2xl border p-4 mb-6 ${
                error
                  ? 'bg-red-500/15 border-red-500 text-red-300'
                  : 'bg-green-500/15 border-green-500 text-green-300'
              }`}
            >
              {error || message}
            </div>
          )}

          <div className='bg-black rounded-3xl aspect-video overflow-hidden border border-border'>
            {isDirectVideo ? (
              <video
                src={activeLecture.videoUrl}
                controls
                className='w-full h-full'
                onEnded={markComplete}
              />
            ) : youtubeMatch ? (
              <iframe
                id="youtube-video-player"
                src={`https://www.youtube.com/embed/${youtubeMatch[1]}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                title={activeLecture.title}
                className='w-full h-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            ) : (
              <iframe
                src={activeLecture.embedUrl || getEmbedUrl(activeLecture.videoUrl)}
                title={activeLecture.title}
                className='w-full h-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            )}
          </div>

          <div className='mt-6 bg-card rounded-3xl p-8 border border-border'>
            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
              <div>
                <h2 className='text-3xl font-bold mb-3'>{activeLecture.title}</h2>
                <p className='text-gray-400'>{activeLecture.description || 'No description added.'}</p>
              </div>
              {user?.role !== 'student' && (
  <button
    onClick={markComplete}
    className='bg-primary px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition'
  >
    Mark Complete
  </button>
)}

{user?.role === 'student' && (
  <div className='mt-6 bg-card rounded-xl p-4 border border-border'>
    <h3 className='text-xl font-bold mb-2'>Rate this Lecture</h3>
    <div className='flex items-center mb-2'>
      {[1,2,3,4,5].map((star) => (
        <svg
          key={star}
          onClick={() => setRating(star)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={star <= rating ? '#fbbf24' : '#d1d5db'}
          className='w-6 h-6 cursor-pointer transition-colors'
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.177c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.962c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.962a1 1 0 00-.364-1.118L2.34 9.39c-.783-.57-.38-1.81.588-1.81h4.177a1 1 0 00.95-.69l1.286-3.962z" />
        </svg>
      ))}
    </div>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder='Leave a comment...'
      rows={3}
      className='w-full p-3 rounded-xl border border-border bg-dark text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
    />
    <button
      onClick={async () => {
        try {
          const res = await reviewService.addReview({
            courseId,
            lectureId: activeLecture._id,
            rating,
            comment,
          });
          setReviewMessage('Review submitted successfully');
          setReviewError('');
        } catch (err) {
          setReviewError(err.response?.data?.message || 'Failed to submit review');
          setReviewMessage('');
        }
      }}
      disabled={rating === 0 || comment.trim() === ''}
      className='mt-2 bg-primary px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
    >
      Submit Review
    </button>
    {(reviewMessage || reviewError) && (
      <p className={`mt-2 ${reviewError ? 'text-red-500' : 'text-green-500'}`}>{reviewMessage || reviewError}</p>
    )}
  </div>
)}
              )}
            </div>

            <div className='mt-8'>
              <h3 className='text-2xl font-bold mb-4'>Resources</h3>
              <div className='space-y-3'>
                {activeLecture.resources?.length ? (
                  activeLecture.resources.map((resource) => (
                    <a
                      key={`${resource.title}-${resource.url}`}
                      href={resource.url}
                      target='_blank'
                      rel='noreferrer'
                      className='block bg-dark p-4 rounded-xl border border-border hover:border-primary transition'
                    >
                      {resource.title || resource.url}
                    </a>
                  ))
                ) : (
                  <p className='text-gray-400'>No resources attached to this lecture.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-12 lg:col-span-3'>
          <div className='bg-card rounded-3xl p-6 border border-border sticky top-24'>
            <h3 className='text-xl font-bold mb-4'>Course Lectures</h3>

            <div className='space-y-3'>
              {lectures.map((lecture) => (
                <Link
                  key={lecture._id}
                  to={`/courses/${courseId}/lectures/${lecture._id}`}
                  className={`block p-4 rounded-xl border transition ${
                    lecture._id === activeLecture._id
                      ? 'bg-primary/20 border-primary'
                      : 'bg-dark border-border hover:border-primary'
                  }`}
                >
                  <p className='font-semibold'>{lecture.title}</p>
                  <p className='text-sm text-gray-400'>{formatDuration(lecture.duration)}</p>
                </Link>
              ))}
            </div>

            {(!allLecturesWatched) && (
                <Link
                  to={`/courses/${courseId}`}
                  className='mt-5 block w-full text-center border border-border bg-dark/45 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-1.5'
                  title="Watch all lectures to unlock the quiz."
                >
                  Review Course
                </Link>
              )}
            {(allLecturesWatched && !quizPassed) && (
              <Link
                to={`/quiz/${courseId}`}
                className='mt-5 block w-full text-center border border-border py-3 rounded-xl font-semibold hover:border-primary transition'
              >
                Complete Quiz to Finish Course
              </Link>
            )}
            {(isCompleted) && (
              <Link
                to={`/certificate/${courseId}`}
                className='mt-5 block w-full text-center border border-border py-3 rounded-xl font-semibold hover:border-primary transition'
              >
                View Certificate
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
