import React from 'react';
import { FaBell, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function PendingEnrollmentsAlert({ count }) {
    if (count === 0) return null;
    
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                        <FaBell className="text-yellow-600" />
                    </div>
                    <div>
                        <p className="font-medium text-yellow-800">
                            {count} Pending Enrollment {count === 1 ? 'Request' : 'Requests'}
                        </p>
                        <p className="text-sm text-yellow-600">
                            Requires your approval
                        </p>
                    </div>
                </div>
                <Link 
                    to="/admin/enrollments?filter=pending"
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600"
                >
                    Review Now
                </Link>
            </div>
        </div>
    );
}
