import Navbar from '../components/common/Navbar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import InstructorDashboard from './InstructorDashboard';
import AdminPanel from './AdminPanel';
import StudentDashboard from '../components/dashboard/StudentDashboard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (user?.role === 'instructor') {
    return <InstructorDashboard />;
  }

  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div>
      <Navbar />

      <div className='p-6 md:p-10'>
        <h1 className='text-3xl md:text-5xl font-bold mb-10'>
          Welcome back, {user?.name || 'Learner'}!
        </h1>
        <StudentDashboard />
      </div>
    </div>
  );
}
