import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import courseService from '../services/courseService';
import userService from '../services/userService';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allUsers, allCourses] = await Promise.all([
        userService.getAllUsers(),
        courseService.getAllCourses(),
      ]);
      setUsers(allUsers);
      setCourses(allCourses);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data');
    }
  };

  const filterByRole = async (value) => {
    setRole(value);
    try {
      const nextUsers = value ? await userService.getUsersByRole(value) : await userService.getAllUsers();
      setUsers(nextUsers);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to filter users');
    }
  };

  const students = users.filter((user) => user.role === 'student').length;
  const instructors = users.filter((user) => user.role === 'instructor').length;

  return (
    <div>
      <Navbar />

      <div className='p-6 md:p-10'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10'>
          <div>
            <h1 className='text-3xl md:text-5xl font-bold'>Admin Dashboard</h1>
            <p className='text-gray-400 mt-3'>Manage users and review platform course activity.</p>
          </div>
          <select
            value={role}
            onChange={(e) => filterByRole(e.target.value)}
            className='bg-card border border-border rounded-xl p-3 outline-none focus:border-primary transition'
          >
            <option value=''>All roles</option>
            <option value='student'>Students</option>
            <option value='instructor'>Instructors</option>
            <option value='admin'>Admins</option>
          </select>
        </div>

        {error && (
          <div className='bg-red-500/15 border border-red-500 text-red-300 rounded-2xl p-4 mb-8'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          <Stat label='Total Users' value={users.length} />
          <Stat label='Students' value={students} />
          <Stat label='Instructors' value={instructors} />
          <Stat label='Courses' value={courses.length} />
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
          <section className='bg-card rounded-3xl p-8 border border-border'>
            <h2 className='text-2xl font-bold mb-6'>Users</h2>
            <div className='space-y-4'>
              {users.map((item) => (
                <div key={item._id} className='bg-dark rounded-2xl p-4 border border-border'>
                  <p className='font-semibold'>{item.name}</p>
                  <p className='text-gray-400 text-sm'>{item.email}</p>
                  <p className='text-primary text-sm capitalize mt-1'>{item.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section className='bg-card rounded-3xl p-8 border border-border'>
            <h2 className='text-2xl font-bold mb-6'>Courses</h2>
            <div className='space-y-4'>
              {courses.map((course) => (
                <div key={course._id} className='bg-dark rounded-2xl p-4 border border-border'>
                  <p className='font-semibold'>{course.title}</p>
                  <p className='text-gray-400 text-sm'>{course.instructor?.name || 'Unknown instructor'}</p>
                  <p className='text-primary text-sm mt-1'>{course.lectures?.length || 0} lectures</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className='bg-card rounded-3xl p-6 border border-border'>
      <p className='text-gray-400 text-sm'>{label}</p>
      <p className='text-3xl font-bold text-primary mt-2'>{value}</p>
    </div>
  );
}
