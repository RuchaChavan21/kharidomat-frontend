import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Chat = () => {
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const res = await fetch('http://localhost:8080/api/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChats(data);
      } catch (err) {
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    if (isLoggedIn) fetchChats();
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`http://localhost:8080/api/chats/${selectedChat.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedChat, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    setSending(true);
    try {
      const res = await fetch(`http://localhost:8080/api/chats/${selectedChat.id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage('');
      }
    } catch (err) {
      // Optionally show error
    } finally {
      setSending(false);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setSidebarOpen(false);
    // Optionally mark as read here
  };

  return (
    <div className="h-screen overflow-hidden flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Left Panel (Sidebar) */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 640) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full sm:w-72 max-w-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 z-20 fixed sm:static h-full sm:h-auto overflow-y-auto"
            style={{ minHeight: '100vh' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-400">Chats</h2>
              <button className="sm:hidden" onClick={() => setSidebarOpen(false)}>
                <FiX className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
            {loadingChats ? (
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-10 text-gray-400 dark:text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">No chats yet</p>
                <p className="text-sm">Start a conversation with an item owner!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className={`rounded-lg px-3 py-2 cursor-pointer flex items-center gap-2 transition-colors duration-200 hover:bg-purple-50 dark:hover:bg-gray-700 ${selectedChat && selectedChat.id === chat.id ? 'bg-purple-100 dark:bg-gray-700' : ''}`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{chat.otherUserName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">{chat.unreadCount}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Sidebar Toggle (Mobile) */}
      {!sidebarOpen && (
        <button
          className="sm:hidden fixed top-4 left-4 z-30 bg-purple-600 text-white p-2 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu className="w-6 h-6" />
        </button>
      )}
      {/* Chat Window */}
      <main className="flex-1 flex flex-col h-[100dvh] sm:h-screen max-h-screen ml-0 sm:ml-72 bg-gray-50 dark:bg-gray-900">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{selectedChat.otherUserName}</div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 dark:bg-gray-900" style={{ minHeight: 0 }}>
              {loadingMessages ? (
                <div className="text-gray-500 dark:text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No messages yet.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`rounded-lg px-4 py-2 shadow card max-w-[80%] ${msg.senderId === user?.id ? 'bg-purple-600 text-white ml-auto' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-auto'} transition-colors duration-300`}> 
                        {msg.text}
                      </div>
                      <div className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-right text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </motion.div>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Message Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-none sticky bottom-0 z-10">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-purple-500 transition-colors duration-300"
                placeholder="Type a message..."
                disabled={sending}
                autoFocus
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                disabled={sending || !newMessage.trim()}
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center h-full min-h-[300px]">
            <p className="text-lg text-gray-500 dark:text-gray-400 text-center">Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat; 