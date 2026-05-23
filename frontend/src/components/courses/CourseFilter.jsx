import { useEffect, useState } from 'react';
import courseService from '../../services/courseService';

export default function CourseFilter({ category, difficulty, sort, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await courseService.getCategories();
        setCategories(list);
      } catch (err) {
        console.error('Failed to load categories in CourseFilter:', err);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className='bg-card/50 backdrop-blur-md rounded-3xl p-6 border border-border/80 mb-8 shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <select
          value={category}
          onChange={(e) => onChange('category', e.target.value)}
          className='bg-dark border border-border/80 rounded-xl p-3 outline-none text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer font-medium text-sm'
        >
          <option value='' className="bg-card text-slate-800 dark:text-white font-medium">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-card text-slate-800 dark:text-white font-medium">
              {cat}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => onChange('difficulty', e.target.value)}
          className='bg-dark border border-border/80 rounded-xl p-3 outline-none text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer font-medium text-sm'
        >
          <option value='' className="bg-card text-slate-800 dark:text-white font-medium">All Difficulties</option>
          <option value='Beginner' className="bg-card text-slate-800 dark:text-white font-medium">Beginner</option>
          <option value='Intermediate' className="bg-card text-slate-800 dark:text-white font-medium">Intermediate</option>
          <option value='Advanced' className="bg-card text-slate-800 dark:text-white font-medium">Advanced</option>
        </select>

        <select
          value={sort}
          onChange={(e) => onChange('sort', e.target.value)}
          className='bg-dark border border-border/80 rounded-xl p-3 outline-none text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer font-medium text-sm'
        >
          <option value='' className="bg-card text-slate-800 dark:text-white font-medium">Sort By Price</option>
          <option value='price-low-high' className="bg-card text-slate-800 dark:text-white font-medium">Price: Low to High</option>
          <option value='price-high-low' className="bg-card text-slate-800 dark:text-white font-medium">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
