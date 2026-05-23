import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import MessageList from './MessageList';
import chatService from '../../services/chatService';

export default function ChatWindow({ courseId, courseName, messages, onSendMessage, loading }) {
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || !courseId) {
      return;
    }

    setSending(true);
    const messageText = inputValue.trim();
    setInputValue('');

    try {
      chatService.sendMessage(courseId, messageText, (response) => {
        if (response?.success === false) {
          setInputValue(messageText); // Restore message on error
        }
      });
      onSendMessage?.(messageText);
    } catch (err) {
      console.error('Error sending message:', err);
      setInputValue(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  if (!courseId) {
    return (
      <div className='col-span-9 bg-card rounded-3xl border border-border flex flex-col items-center justify-center'>
        <p className='text-gray-400 text-lg'>Select a course to start chatting</p>
      </div>
    );
  }

  return (
    <div className='col-span-9 bg-card rounded-3xl border border-border flex flex-col'>
      <div className='p-6 border-b border-border flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>{courseName}</h2>
          <p className='text-sm text-gray-400 mt-1'>Course Discussion</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className={`w-2 h-2 rounded-full ${chatService.isConnected() ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className='text-xs text-gray-400'>{chatService.isConnected() ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <MessageList messages={messages} loading={loading} />

      <div className='p-6 border-t border-border'>
        <form onSubmit={handleSendMessage} className='flex gap-3'>
          <input
            type='text'
            placeholder={chatService.isConnected() ? 'Type a message...' : 'Connecting...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={sending || !courseId || !chatService.isConnected()}
            className='flex-1 bg-dark border border-border rounded-xl p-4 outline-none focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed'
          />
          <button
            type='submit'
            disabled={sending || !inputValue.trim() || !courseId || !chatService.isConnected()}
            className='bg-primary px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            <FaPaperPlane className='text-sm' />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
