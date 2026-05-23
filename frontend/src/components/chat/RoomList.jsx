import { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import courseService from '../../services/courseService';

export default function RoomList({ selectedRoom, onSelectRoom, courses, onlineCounts = {} }) {
  const [roomsWithCount, setRoomsWithCount] = useState([]);

  useEffect(() => {
    // Initialize room data from courses
    const rooms = courses.map((course) => ({
      id: course._id,
      name: course.title,
      unread: 0,
      usersOnline: onlineCounts[course._id] || 0,
    }));
    setRoomsWithCount(rooms);
  }, [courses, onlineCounts]);

  if (!courses.length) {
    return (
      <div className='col-span-3 bg-card rounded-3xl border border-border overflow-hidden flex flex-col'>
        <div className='p-6 border-b border-border'>
          <h2 className='text-2xl font-bold'>Courses</h2>
        </div>
        <div className='flex-1 flex items-center justify-center p-6 text-gray-400'>
          <p>No courses available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='col-span-3 bg-card rounded-3xl border border-border overflow-hidden flex flex-col'>
      <div className='p-6 border-b border-border'>
        <h2 className='text-2xl font-bold'>Courses</h2>
      </div>

      <div className='flex-1 overflow-y-auto space-y-2 p-4'>
        {roomsWithCount.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`w-full text-left p-4 rounded-xl transition ${
              selectedRoom === room.id
                ? 'bg-primary border border-primary'
                : 'bg-dark border border-border hover:border-primary'
            }`}
          >
            <p className='font-semibold truncate'>{room.name}</p>
            <div className='flex items-center gap-2 mt-2 text-sm text-gray-400'>
              <FaUsers className='text-xs' />
              <span>{room.usersOnline} online</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
