import React, { useState, useEffect } from 'react';
import socket from '../socket';

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('notification', (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div>
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((note, index) => (
            <div key={index} className="notification">
              {note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
