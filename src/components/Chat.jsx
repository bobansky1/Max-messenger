import { useState, useEffect, useRef } from 'react';
import GreenApiService from '../services/greenApi';
import { SendIcon, ArrowBackIcon, LogoutIcon, SearchIcon } from './Icons';
import './Chat.css';

function Chat({ idInstance, apiToken, onLogout }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const apiService = useRef(new GreenApiService(idInstance, apiToken)).current;

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling для получения сообщений
  useEffect(() => {
    if (!isChatStarted) return;

    const pollMessages = async () => {
      try {
        const notification = await apiService.receiveNotification();
        
        if (notification && notification.receiptId) {
          const { body, receiptId } = notification;
          
          // Проверяем, что это входящее текстовое сообщение от нашего контакта
          if (
            body &&
            body.typeWebhook === 'incomingMessageReceived' &&
            body.messageData &&
            body.messageData.typeMessage === 'textMessage'
          ) {
            const senderChatId = body.senderData.chatId;
            
            // Проверяем, что сообщение от нужного контакта
            if (senderChatId === chatId) {
              const newMessage = {
                id: body.idMessage,
                text: body.messageData.textMessageData.textMessage,
                timestamp: body.timestamp,
                isOwn: false,
                sender: body.senderData.sender,
              };

              setMessages((prev) => {
                // Проверяем, что такого сообщения еще нет
                if (!prev.find((msg) => msg.id === newMessage.id)) {
                  return [...prev, newMessage];
                }
                return prev;
              });
            }
          }

          // Удаляем обработанное уведомление
          await apiService.deleteNotification(receiptId);
        }
      } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
      }
    };

    // Запускаем polling каждые 2 секунды
    pollingIntervalRef.current = setInterval(pollMessages, 2000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isChatStarted, chatId, apiService]);

  const handleStartChat = () => {
    if (!phoneNumber.trim()) {
      alert('Введите номер телефона');
      return;
    }

    // Форматируем номер телефона для MAX (формат WhatsApp: номер@c.us)
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Убеждаемся, что номер начинается с 7 (для России)
    if (!formattedPhone.startsWith('7') && !formattedPhone.startsWith('8')) {
      formattedPhone = '7' + formattedPhone;
    } else if (formattedPhone.startsWith('8')) {
      formattedPhone = '7' + formattedPhone.substring(1);
    }

    // Для MAX используется формат WhatsApp: номер@c.us
    const newChatId = `${formattedPhone}@c.us`;
    setChatId(newChatId);
    setIsChatStarted(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await apiService.sendMessage(chatId, message);

      if (response && response.idMessage) {
        const newMessage = {
          id: response.idMessage,
          text: message,
          timestamp: Date.now(),
          isOwn: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Не удалось отправить сообщение. Проверьте номер телефона и подключение.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isChatStarted) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>MAX Messenger</h2>
          <button onClick={onLogout} className="logout-button">
            <LogoutIcon />
            <span>Выйти</span>
          </button>
        </div>

        <div className="start-chat-container">
          <div className="start-chat-card">
            <h3>Начать новый чат</h3>
            <p>Введите номер телефона получателя</p>
            <div className="phone-input-group">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+7 (900) 123-45-67"
                className="phone-input"
              />
              <button onClick={handleStartChat} className="start-chat-button">
                Начать чат
              </button>
            </div>
            <small className="hint">
              Формат: +7XXXXXXXXXX или 8XXXXXXXXXX
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-info">
          <button onClick={() => setIsChatStarted(false)} className="back-button">
            <ArrowBackIcon />
          </button>
          <div>
            <h3>{phoneNumber}</h3>
            <span className="status">Онлайн</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <SearchIcon />
          </button>
          <button onClick={onLogout} className="icon-button">
            <LogoutIcon />
          </button>
        </div>
      </div>

      <div className="chat-content-area">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-date">Сегодня</div>
              <div className="empty-chat-message">Начните переписку</div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.isOwn ? 'message-own' : 'message-other'}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-input-container">
          <div className="message-input-wrapper">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Сообщение"
              className="message-input"
              disabled={loading}
            />
            <button type="submit" className="send-button" disabled={loading || !message.trim()}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
