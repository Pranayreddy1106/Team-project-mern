import CourseCard from './CourseCard';

export default function CourseGrid({ courses }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}    
    </div>
  );
}  