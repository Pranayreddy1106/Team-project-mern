import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export default function CourseCard({ course }) {
  const students = Array.isArray(course.students) ? course.students.length : course.students || 0;
  const rating = course.averageRating || course.rating || 0;

  // Generate a color-based thumbnail using the course title
  const generateThumbnail = () => {
    if (course.thumbnail) return course.thumbnail;
    
    // Create a deterministic color from course title
    let hash = 0;
    const str = course.title || 'Course';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const colors = ['8B5CF6', '6366F1', 'EC4899', 'F59E0B', '10B981', '06B6D4', 'EF4444'];
    const color = colors[Math.abs(hash) % colors.length];
    
    // Use a more reliable image service
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=${color}&color=fff&size=400&bold=true&font-size=0.35`;
  };

  return (
    <Link
      to={`/courses/${course._id}`}
      className='bg-card rounded-3xl overflow-hidden border border-border hover:scale-[1.02] transition duration-300 hover:border-primary'
    >
      <div className='relative'>
        <img
          src={generateThumbnail()}
          alt={course.title}
          className='h-48 w-full object-cover bg-dark'
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=8B5CF6&color=fff&size=400&bold=true`;
          }}
        />
        <div className='absolute top-3 right-3 bg-primary px-3 py-1 rounded-full text-sm font-semibold'>
          {course.price ? `$${course.price}` : 'Free'}
        </div>
      </div>

      <div className='p-5'>
        <div className='flex items-center gap-2 mb-3 flex-wrap'>
          {course.category && (
            <span className='bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0'>
              {course.category}
            </span>
          )}
          {course.difficulty && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shrink-0 ${
              course.difficulty === 'Beginner'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : course.difficulty === 'Intermediate'
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {course.difficulty}
            </span>
          )}
        </div>

        <h2 className='text-lg font-semibold line-clamp-2'>
          {course.title}
        </h2>

        <p className='text-gray-400 mt-2 line-clamp-2 text-sm'>
          {course.description}
        </p>

        <div className='flex items-center gap-2 mt-4'>
          <FaStar className='text-yellow-400' />
          <span className='text-sm'>{rating ? rating.toFixed?.(1) || rating : 'New'}</span>
          <span className='text-gray-500 text-sm'>({students} students)</span>
        </div>

        <button className='mt-4 bg-primary px-4 py-2 rounded-xl w-full hover:bg-purple-700 transition font-semibold'>
          View Course
        </button>
      </div>
    </Link>
  );
}
