    import React, { useState, useEffect, useRef } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import SockJS from 'sockjs-client';
    import Stomp from 'stompjs';
    import { FaPaperPlane } from 'react-icons/fa';
    import API from '../services/api';

    const ChatPage = () => {
        const location = useLocation();
        const navigate = useNavigate();
        const { user, token } = useAuth();

        const { recipient, chatId } = location.state || {};

        const [messages, setMessages] = useState([]);
        const [newMessage, setNewMessage] = useState("");
        const [isLoadingHistory, setIsLoadingHistory] = useState(true);
        const stompClient = useRef(null);
        const messagesEndRef = useRef(null);

        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [messages]);

        useEffect(() => {
            if (!recipient || !chatId) {
                console.error("Chat details are missing. Redirecting...");
                navigate('/');
            }
        }, [recipient, chatId, navigate]);

        useEffect(() => {
            if (!chatId || !token || !user) {
                return;
            }

            const fetchHistory = async () => {
                setIsLoadingHistory(true);
                try {
                    const response = await API.get(`/chats/${chatId}/messages`);
                    setMessages(response.data || []);
                } catch (error) {
                    console.error("Failed to fetch chat history:", error);
                } finally {
                    setIsLoadingHistory(false);
                }
            };

            const connect = () => {
                const socketUrl = `http://localhost:8080/ws?token=${token}`;
                const socket = new SockJS(socketUrl);
                stompClient.current = Stomp.over(socket);
                stompClient.current.debug = null;

                stompClient.current.connect({}, (frame) => {
                    console.log('WebSocket Connected: ' + frame);
                    stompClient.current.subscribe('/user/queue/messages', (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    });
                }, (error) => {
                    console.error('StompJS Connection Error:', error);
                    if (error.headers) {
                        console.error('Error headers:', error.headers);
                        console.error('Error message from server:', error.headers.message);
                    }
                });
            };

            fetchHistory();
            connect();

            // --- THIS IS THE FIX ---
            // The cleanup function now checks if the client is fully connected before trying to disconnect.
            return () => {
                if (stompClient.current && stompClient.current.connected) {
                    stompClient.current.disconnect();
                    console.log('WebSocket Disconnected');
                } else {
                    console.log('WebSocket cleanup: Connection not established, no need to disconnect.');
                }
            };
        }, [chatId, token, user]);

        const handleSendMessage = () => {
            if (newMessage.trim() && stompClient.current && user) {
                const messagePayload = {
                    chatId: chatId,
                    content: newMessage,
                };
                stompClient.current.send("/app/chat.private", {}, JSON.stringify(messagePayload));
                setNewMessage("");
            }
        };

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20 pb-10">
                <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-white rounded-xl shadow-lg border">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-4 border-b bg-gray-50 rounded-t-xl">
                        <img
                            src={recipient?.profilePictureUrl || '/default-avatar.png'}
                            alt={recipient?.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{recipient?.name || 'User'}</h2>
                            <p className="text-sm text-green-600">Online</p>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                        {isLoadingHistory ? (
                            <div className="text-center text-gray-500">Loading history...</div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex mb-4 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md break-words ${msg.senderId === user.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        <p>{msg.content}</p>
                                        <p className="text-xs opacity-70 text-right mt-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Section */}
                    <div className="bg-white p-4 border-t rounded-b-xl flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 text-white font-bold rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    export default ChatPage;
