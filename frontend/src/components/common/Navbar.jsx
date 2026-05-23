import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { FaMoon, FaSearch, FaSignOutAlt, FaSun, FaUserCircle } from 'react-icons/fa';
import courseService from '../../services/courseService';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium transition ${
    isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'
  }`;

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);

  const searchVal = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    setSearch(searchVal);
  }, [searchVal]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await courseService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories in Navbar:', err);
      }
    };
    fetchCats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    navigate(`/courses?${params.toString()}`);
  };

  const handleFilterChange = (name, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    if (search.trim()) {
      params.set('search', search.trim());
    }
    navigate(`/courses?${params.toString()}`);
  };

  const dashboardLabel =
    user?.role === 'instructor'
      ? 'Instructor'
      : user?.role === 'admin'
        ? 'Admin'
        : 'Dashboard';

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur'>
      <nav className='px-4 md:px-8 py-3'>
        <div className='flex items-center gap-4'>
          <Link className='text-2xl font-black tracking-tight text-primary shrink-0' to='/'>
            EduFlow
          </Link>

          <div className='hidden lg:flex items-center gap-1 shrink-0'>
            <NavLink to='/courses' className={navLinkClass}>
              Browse
            </NavLink>
            {user && (
              <>
                <NavLink to='/dashboard' className={navLinkClass}>
                  {dashboardLabel}
                </NavLink>
                <NavLink to='/chat' className={navLinkClass}>
                  Chat
                </NavLink>
              </>
            )}
          </div>

          {/* Search & Dynamic Filter Command Bar on Desktop */}
          <div className='hidden md:flex items-center gap-3 flex-1 max-w-4xl'>
            <form onSubmit={handleSearch} className='flex-1'>
              <label className='flex h-11 items-center gap-3 rounded-full border border-border bg-dark px-4 focus-within:border-primary transition cursor-text'>
                <FaSearch className='text-gray-400 shrink-0' />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search courses by title, keywords...'
                  className='w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                />
              </label>
            </form>

            <select
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className='bg-dark border border-border rounded-full px-4 py-2 text-xs outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-primary transition'
            >
              <option value=''>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className='bg-dark border border-border rounded-full px-4 py-2 text-xs outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-primary transition'
            >
              <option value=''>All Difficulties</option>
              <option value='Beginner'>Beginner</option>
              <option value='Intermediate'>Intermediate</option>
              <option value='Advanced'>Advanced</option>
            </select>

            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className='bg-dark border border-border rounded-full px-4 py-2 text-xs outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-primary transition'
            >
              <option value=''>Sort By Price</option>
              <option value='price-low-high'>Low to High</option>
              <option value='price-high-low'>High to Low</option>
            </select>
          </div>

          <div className='ml-auto flex items-center gap-2 shrink-0'>
            <button
              onClick={toggleTheme}
              className='grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition'
              aria-label='Toggle light mode'
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <>
                <Link
                  to='/profile'
                  className='grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition'
                  aria-label='Profile'
                >
                  <FaUserCircle className='text-xl' />
                </Link>
                <button
                  onClick={handleLogout}
                  className='grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition'
                  aria-label='Logout'
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='hidden sm:inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold hover:border-primary hover:text-primary transition'
                >
                  Log in
                </Link>
                <Link
                  to='/register'
                  className='inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition'
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Search & Dynamic Filter Command Bar on Mobile */}
        <div className='mt-3 md:hidden space-y-2'>
          <form onSubmit={handleSearch}>
            <label className='flex h-11 items-center gap-3 rounded-full border border-border bg-dark px-4 focus-within:border-primary transition'>
              <FaSearch className='text-gray-400 shrink-0' />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search courses'
                className='w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-gray-500'
              />
            </label>
          </form>
          <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-none'>
            <select
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className='bg-dark border border-border rounded-full px-3 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-primary transition shrink-0'
            >
              <option value=''>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className='bg-dark border border-border rounded-full px-3 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-primary transition shrink-0'
            >
              <option value=''>All Difficulties</option>
              <option value='Beginner'>Beginner</option>
              <option value='Intermediate'>Intermediate</option>
              <option value='Advanced'>Advanced</option>
            </select>

            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className='bg-dark border border-border rounded-full px-3 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-primary transition shrink-0'
            >
              <option value=''>Sort By Price</option>
              <option value='price-low-high'>Low to High</option>
              <option value='price-high-low'>High to Low</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}
