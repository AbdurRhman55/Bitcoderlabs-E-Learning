// components/Notification.jsx
import React, { useEffect, useState } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ message, type = 'info', duration = 4000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) return null;

    const getNotificationStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md transform transition-all duration-300";

        switch (type) {
            case 'success':
                return `${baseStyles} bg-emerald-50 border-l-4 border-emerald-500`;
            case 'error':
                return `${baseStyles} bg-red-50 border-l-4 border-red-500`;
            case 'warning':
                return `${baseStyles} bg-amber-50 border-l-4 border-amber-500`;
            default:
                return `${baseStyles} bg-blue-50 border-l-4 border-primary`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheck className="text-emerald-600" />;
            case 'error':
                return <FaExclamationTriangle className="text-red-600" />;
            case 'warning':
                return <FaExclamationTriangle className="text-amber-600" />;
            default:
                return <FaInfoCircle className="text-primary" />;
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success': return 'text-emerald-800';
            case 'error': return 'text-red-800';
            case 'warning': return 'text-amber-800';
            default: return 'text-blue-800';
        }
    };

    return (
        <div className={getNotificationStyles()}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className={`flex-1 font-medium ${getTextColor()}`}>
                    {message}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close notification"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default Notification;
