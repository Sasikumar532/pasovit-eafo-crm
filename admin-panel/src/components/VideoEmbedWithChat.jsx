import React, { useState, useRef } from 'react';

const VideoEmbedWithChat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const iframeRef = useRef(null);  // To scroll to the video iframe when chat is sent

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage('');
      // Scroll to the iframe after sending a message
      iframeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
        <iframe
          src="https://kinescope.io/embed/82LqdaoT1ugEq3BuZR4vme"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
          frameBorder="0"
          allowFullScreen
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
          ref={iframeRef}
        />
      </div>

      <div>
        <div style={{ marginTop: '20px' }}>
          <h3>Chat</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {chatMessages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type a message..."
              style={{ width: '80%', padding: '8px' }}
            />
            <button type="submit" style={{ padding: '8px', marginLeft: '10px' }}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoEmbedWithChat;
