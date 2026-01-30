import React from "react";
import { API_ORIGIN } from "../../api/index.js";
import { Edit2, Trash2, Eye, Users, Clock, DollarSign } from "lucide-react";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

const AdminCourseCard = ({ course, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  const resolveImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    const stringUrl = String(url).trim();
    if (stringUrl.startsWith('http') || stringUrl.startsWith('data')) return stringUrl;

    let cleanPath = stringUrl.startsWith('/') ? stringUrl.substring(1) : stringUrl;

    // Check if the path already includes 'storage/'
    if (cleanPath.startsWith('storage/')) {
      return `${API_ORIGIN}/${cleanPath}`;
    }

    // Default to the storage folder
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Course Image Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={resolveImageUrl(course.image) || PLACEHOLDER_IMAGE}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (e.target.src !== PLACEHOLDER_IMAGE) {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }
          }}
        />

        {/* Course Level Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${course.level === "beginner"
              ? "bg-green-100 text-green-800"
              : course.level === "intermediate"
                ? "bg-yellow-100 text-yellow-800"
                : course.level === "advanced"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
          >
            {course.level}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {course.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {course.category?.name || course.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-3">
          By {course.instructor?.user?.name || course.instructor?.name || course.instructor}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{course.students_count || 0} students</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <DollarSign className="w-4 h-4" />
            <span>{formatPrice(course.price)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>⭐ {course.rating || 0}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(course)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(course.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Eye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCard;
