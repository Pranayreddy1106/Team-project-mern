import io from 'socket.io-client';
import tokenManager from '../utils/tokenManager';

class ChatService {
  constructor() {
    this.socket = null;
    this.currentCourseId = null;
  }

  connect() {
    if (this.socket?.connected) return;

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(courseId, callback) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const token = tokenManager.getToken();
    if (!token) {
      console.error('No token available');
      return;
    }

    this.currentCourseId = courseId;
    this.socket.emit('join_room', { token, courseId }, (response) => {
      if (callback) callback(response);
    });
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }

  emit(event, data, callback) {
    this.socket?.emit(event, data, callback);
  }

  leaveRoom(courseId) {
    if (!this.socket?.connected) return;

    const token = tokenManager.getToken();
    this.socket.emit('leave_room', { token, courseId });
    this.currentCourseId = null;
  }

  sendMessage(courseId, message, callback) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const token = tokenManager.getToken();
    this.socket.emit('send_message', { token, courseId, message }, (response) => {
      if (callback) callback(response);
    });
  }

  getRoomInfo(courseId, callback) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const token = tokenManager.getToken();
    this.socket.emit('get_room_info', { token, courseId }, (response) => {
      if (callback) callback(response);
    });
  }

  onTyping(courseId, callback) {
    this.socket?.on('user_typing', (data) => {
      if (callback) callback(data);
    });
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new ChatService();
