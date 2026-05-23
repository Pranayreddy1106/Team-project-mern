import { useCallback, useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import CourseGrid from '../components/courses/CourseGrid';
import CourseFilter from '../components/courses/CourseFilter';
import Loading from '../components/common/Loading';
import courseService from '../services/courseService';
import { useSearchParams } from 'react-router-dom';

export default function AllCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const sort = searchParams.get('sort') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = {};
        if (search) queryParams.search = search;
        if (category) queryParams.category = category;
        if (difficulty) queryParams.difficulty = difficulty;
        if (sort) queryParams.sort = sort;

        const list = await courseService.getAllCourses(queryParams);
        setCourses(list);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.response?.data?.message || 'Unable to load courses from the API');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCourses();
  }, [search, category, difficulty, sort]);

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    setSearchParams(params);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />

      <div className='p-6 md:p-10'>
        <div className='mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold mb-3'>All Courses</h1>
          <p className='text-gray-400 text-lg'>
            Explore our collection of {courses.length} premium courses
          </p>
        </div>

        <CourseFilter
          category={category}
          difficulty={difficulty}
          sort={sort}
          onChange={handleFilterChange}
        />

        {error && (
          <div className='bg-red-500/15 border border-red-500 text-red-300 rounded-2xl p-4 mb-8'>
            {error}
          </div>
        )}

        {courses.length > 0 ? (
          <CourseGrid courses={courses} />
        ) : (
          <div className='text-center py-20'>
            <p className='text-2xl text-gray-400'>
              No courses found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
