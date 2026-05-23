import { useState, useEffect, useContext, useCallback } from 'react';
import RoomList from './RoomList';
import ChatWindow from './ChatWindow';
import chatService from '../../services/chatService';
import courseService from '../../services/courseService';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../common/Loading';

export default function ChatBox({ initialCourseId }) {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(initialCourseId || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [onlineCounts, setOnlineCounts] = useState({});
  const [error, setError] = useState('');

  // Update selected room when initialCourseId changes
  useEffect(() => {
    if (initialCourseId) {
      setSelectedRoom(initialCourseId);
    }
  }, [initialCourseId]);

  // Connect to socket and load user's courses
  useEffect(() => {
    const initialize = async () => {
      try {
        // Connect socket
        if (!chatService.isConnected()) {
          chatService.connect();
        }

        // Load user's courses (enrolled courses for students, created courses for instructors)
        if (user) {
          let courseList = [];
          if (user.role === 'student') {
            courseList = await courseService.getMyCourses();
          } else if (user.role === 'instructor') {
            courseList = await courseService.getMyCourses();
          } else if (user.role === 'admin') {
            courseList = await courseService.getAllCourses();
          }
          setCourses(courseList);
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (selectedRoom) {
        chatService.leaveRoom(selectedRoom);
      }
    };
  }, [user]);

  // Handle socket listeners
  useEffect(() => {
    if (!chatService.isConnected()) return;

    const handleLoadMessages = (data) => {
      setMessages(data.messages || []);
      setChatLoading(false);
      if (data.roomInfo) {
        setOnlineCounts(prev => ({
          ...prev,
          [data.roomInfo.courseId]: data.roomInfo.totalUsers
        }));
      }
    };

    const handleReceiveMessage = (message) => {
      const msgUserId = message.userId?._id || message.userId;
      const isOwn = msgUserId === user?.id;
      if (!isOwn) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleUserJoined = (data) => {
      console.log('User joined:', data.userName);
      if (data.courseId) {
        setOnlineCounts(prev => ({
          ...prev,
          [data.courseId]: data.totalUsers
        }));
      }
    };

    const handleUserLeft = (data) => {
      console.log('User left:', data.userName);
      if (data.courseId) {
        setOnlineCounts(prev => ({
          ...prev,
          [data.courseId]: data.totalUsers
        }));
      }
    };

    chatService.on('load_messages', handleLoadMessages);
    chatService.on('receive_message', handleReceiveMessage);
    chatService.on('user_joined', handleUserJoined);
    chatService.on('user_left', handleUserLeft);

    return () => {
      chatService.off('load_messages', handleLoadMessages);
      chatService.off('receive_message', handleReceiveMessage);
      chatService.off('user_joined', handleUserJoined);
      chatService.off('user_left', handleUserLeft);
    };
  }, [selectedRoom, user?.id]);

  // Re-join on reconnection
  useEffect(() => {
    if (!chatService.isConnected()) return;

    const handleConnect = () => {
      console.log('Socket reconnected, joining room:', selectedRoom);
      if (selectedRoom) {
        chatService.joinRoom(selectedRoom);
      }
    };

    chatService.on('connect', handleConnect);
    return () => chatService.off('connect', handleConnect);
  }, [selectedRoom]);

  // Join selected room
  useEffect(() => {
    if (!selectedRoom || !chatService.isConnected()) return;

    setChatLoading(true);
    setMessages([]);

    chatService.joinRoom(selectedRoom);

    return () => {
      chatService.leaveRoom(selectedRoom);
    };
  }, [selectedRoom]);

  const handleSelectRoom = (courseId) => {
    setSelectedRoom(courseId);
  };

  const handleSendMessage = useCallback((message) => {
    if (!user) return;
    setMessages((prev) => [...prev, { 
      message, 
      timestamp: new Date(),
      userId: user.id,
      userName: user.name,
      userRole: user.role
    }]);
  }, [user]);

  if (loading) return <Loading />;

  const selectedCourse = courses.find((c) => c._id === selectedRoom);
  const courseName = selectedCourse?.title || 'Chat Room';

  return (
    <div className='grid grid-cols-12 gap-6 p-6 h-full'>
      <RoomList
        courses={courses}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onlineCounts={onlineCounts}
      />
      <ChatWindow
        courseId={selectedRoom}
        courseName={courseName}
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={chatLoading}
      />
    </div>
  );
}
