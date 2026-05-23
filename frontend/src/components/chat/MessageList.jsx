import { useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function MessageList({ messages, loading }) {
  const { user } = useContext(AuthContext);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-gray-400'>Loading messages...</p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-gray-400'>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto p-6 space-y-4'>
      {messages.map((msg, index) => {
        const msgUserId = msg.userId?._id || msg.userId;
        const isOwnMessage = msgUserId === user?.id;
        
        return (
          <div
            key={msg._id || index}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 ${
                isOwnMessage
                  ? 'bg-primary text-white'
                  : 'bg-dark border border-border text-gray-100'
              }`}
            >
              {!isOwnMessage && (
                <Link 
                  to={`/profile/${msgUserId}`}
                  className='text-xs font-semibold text-primary mb-1 hover:underline block'
                >
                  {msg.userName || 'Anonymous'}
                </Link>
              )}
              <p className='text-sm break-words'>{msg.message}</p>
              <p className='text-xs opacity-70 mt-1'>
                {msg.timestamp
                  ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })
                  : 'Just now'}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
