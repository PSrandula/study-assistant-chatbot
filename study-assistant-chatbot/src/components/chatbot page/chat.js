import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/firebaseConfig";
import { auth } from "../../firebase/firebaseConfig";
import { ref, push, onValue, remove } from "firebase/database";
import { getGeminiResponse } from "../../api/geminiAPI";
import "./chat.css";
import { BsArrowUpCircle } from 'react-icons/bs';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Move handleKeyPress inside component
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const chatRef = ref(db, "messages");
    remove(chatRef)
      .then(() => {
        console.log("Chat cleared");
      })
      .catch((error) => {
        console.error("Error clearing chat:", error);
      });
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        window.location.href = "/"; 
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const chatRef = ref(db, "messages");
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.values(data);
        setMessages(formatted);
      } else {
        setMessages([]);
      }
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to send messages.");
      return;
    }

    const userMessage = {
      role: "user",
      text: input,
      sender: user.displayName || user.email || "Anonymous",
      timestamp: Date.now()
    };

    await push(ref(db, "messages"), userMessage);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const botReply = await getGeminiResponse(input, [...messages, userMessage]);
      const assistantMessage = {
        role: "assistant",
        text: botReply,
        sender: "Mr. Pasindu",
        timestamp: Date.now()
      };
      await push(ref(db, "messages"), assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">📚</div>
            <h2>Study Assistant</h2>
          </div>
        </div>
        <div className="header-right">
          <button className="clear-btn" onClick={clearChat} title="Clear Chat">
            clear
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <div className="logout-icon"></div>
            Logout
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="chat-history">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">💬</div>
              <h3>Welcome to Study Assistant Mr.Pasindu!</h3>
              <p>Start a conversation by typing your question below.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "user" ? "👤" : "👨‍🏫"}
                </div>
                <div className={`message ${msg.role}`}>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="message-avatar"></div>
              <div className="message assistant typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <div className="chat-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
              rows="1"
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className={`send-btn ${input.trim() ? 'active' : ''}`}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span className="send-icon">
                  <BsArrowUpCircle size={22} color="#1a73e8" />
                </span>

              )}
            </button>
          </div>
          <div className="input-hint">
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;