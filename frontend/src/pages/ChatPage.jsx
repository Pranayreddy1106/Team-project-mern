import { useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { ChatBox } from '../components/chat';
import { AuthContext } from '../context/AuthContext';

export default function ChatPage() {
  const { user } = useContext(AuthContext);
  const { courseId } = useParams();

  // Redirect non-authenticated users to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='h-[calc(100vh-80px)] overflow-hidden'>
        <ChatBox initialCourseId={courseId} />
      </div>
    </div>
  );
}