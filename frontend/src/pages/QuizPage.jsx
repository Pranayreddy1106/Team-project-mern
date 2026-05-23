import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import quizService from '../services/quizService';
import { AuthContext } from '../context/AuthContext';

export default function QuizPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await quizService.getQuiz(id);
        setQuiz(data);
        setAnswers(new Array(data.questions?.length || 0).fill(null));
      } catch (err) {
        setError(err.response?.data?.message || 'Quiz not available');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const selectAnswer = (questionIndex, optionIndex) => {
    setAnswers((items) =>
      items.map((item, index) => (index === questionIndex ? optionIndex : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (answers.some((answer) => answer === null)) {
      setError('Please answer every question before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await quizService.attemptQuiz(id, answers);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />

      <div className='min-h-[calc(100vh-80px)] p-6 md:p-10'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-card rounded-3xl p-6 md:p-10 border border-border'>
            <div className='mb-8'>
              <h1 className='text-3xl md:text-4xl font-bold mb-2'>Course Quiz</h1>
              <p className='text-gray-400'>Passing score is 75%.</p>
            </div>

            {error && (
              <div className='bg-red-500/15 border border-red-500 text-red-300 rounded-2xl p-4 mb-6'>
                {error}
              </div>
            )}

            {result && (
              <div
                className={`rounded-2xl border p-5 mb-8 ${
                  result.passed
                    ? 'bg-green-500/15 border-green-500 text-green-300'
                    : 'bg-red-500/15 border-red-500 text-red-300'
                }`}
              >
                <p className='text-2xl font-bold'>{Math.round(result.score)}%</p>
                <p>{result.passed ? 'Passed' : 'Not passed yet. Review the lectures and try again.'}</p>
              </div>
            )}

            {!quiz ? (
              <div>
                <p className='text-gray-400 mb-6'>No quiz has been published for this course.</p>
                <Link to={`/courses/${id}`} className='text-primary font-semibold'>
                  Back to course
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-8'>
                {quiz.questions.map((question, questionIndex) => (
                  <div key={question._id || questionIndex} className='bg-dark rounded-2xl p-6 border border-border'>
                    <h3 className='text-xl font-bold mb-4'>
                      {questionIndex + 1}. {question.question}
                    </h3>

                    <div className='space-y-3'>
                      {question.options.map((option, optionIndex) => {
                        const selected = answers[questionIndex] === optionIndex;
                        const showCorrect = user?.role !== 'student' && question.correctAnswer === optionIndex;

                        return (
                          <label
                            key={`${questionIndex}-${optionIndex}`}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                              selected || showCorrect
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary'
                            }`}
                          >
                            <input
                              type='radio'
                              name={`question-${questionIndex}`}
                              checked={selected}
                              disabled={user?.role !== 'student' || Boolean(result)}
                              onChange={() => selectAnswer(questionIndex, optionIndex)}
                              className='w-4 h-4'
                            />
                            <span className='font-medium'>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {user?.role === 'student' ? (
                  <button
                    type='submit'
                    disabled={submitting || Boolean(result)}
                    className='bg-primary w-full py-4 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60'
                  >
                    {submitting ? 'Submitting...' : result ? 'Submitted' : 'Submit Quiz'}
                  </button>
                ) : (
                  <p className='text-gray-400'>Instructor and admin accounts can review the quiz but cannot submit attempts.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
