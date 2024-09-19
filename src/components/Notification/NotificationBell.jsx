import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Icône de coche pour le marquage
import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notificationService";
import { useAuth } from "../../context/AuthContext";
import io from "socket.io-client";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated } = useAuth();
  const APIBaseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let socket;
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(token);
        // Trier les notifications : non lues en premier, puis par date de création, de la plus récente à la plus ancienne
        const sortedData = data.sort((a, b) => {
          if (a.is_read === b.is_read) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.is_read ? 1 : -1;
        });
        setNotifications(sortedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications :",
          error
        );
      }
    };

    if (isAuthenticated && token) {
      socket = io(APIBaseURL, { auth: { token } });

      fetchNotifications(); // Récupérer les notifications au premier rendu

      const interval = setInterval(fetchNotifications, 60000);

      socket.on("notification", (notification) => {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [notification, ...prevNotifications];
          return updatedNotifications.sort((a, b) => {
            if (a.is_read === b.is_read) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.is_read ? 1 : -1;
          });
        });
      });

      return () => {
        clearInterval(interval);
        socket.off("notification");
      };
    }
  }, [isAuthenticated, APIBaseURL]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");
    try {
      await markNotificationAsRead(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications
          .map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
          .sort((a, b) => {
            if (a.is_read === b.is_read) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.is_read ? 1 : -1;
          })
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la notification :",
        error
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".icon-bell")
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="notification-bell">
      <div className="icon-bell" onClick={toggleDropdown}>
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </div>
      {showDropdown && (
        <div className="notification-dropdown" ref={dropdownRef}>
          <ul>
            {notifications.length === 0 ? (
              <li>Aucune notification</li>
            ) : (
              notifications.map((notification, index) => (
                <li
                  key={index}
                  className={notification.is_read ? "read" : "unread"}
                >
                  <p>{notification.message}</p>
                  {!notification.is_read && (
                    <AiOutlineCheckCircle
                      className="mark-read-icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
