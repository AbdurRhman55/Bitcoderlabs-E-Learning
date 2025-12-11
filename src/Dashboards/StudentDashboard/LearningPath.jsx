// LearningPath.jsx
import React from 'react';

const LearningPath = () => {
  const paths = [
    {
      title: 'Frontend Mastery',
      progress: 85,
      courses: 8,
      completed: 6,
      color: 'primary',
      nextCourse: 'Advanced React Hooks',
      deadline: '3 days left'
    },
    {
      title: 'Backend Development',
      progress: 45,
      courses: 6,
      completed: 2,
      color: 'green',
      nextCourse: 'Node.js Security',
      deadline: '1 week left'
    },
    {
      title: 'DevOps Fundamentals',
      progress: 30,
      courses: 5,
      completed: 1,
      color: 'purple',
      nextCourse: 'Docker & Containers',
      deadline: '2 weeks left'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'from-primary to-primary-dark',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Learning Paths</h3>
        <button className="text-primary hover:text-primary-dark text-sm font-medium flex items-center space-x-1">
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      <div className="space-y-4">
        {paths.map((path, index) => (
          <div key={index} className="group p-4 rounded-xl border border-gray-200/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {path.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {path.completed}/{path.courses} courses completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{path.progress}%</div>
                <div className="text-xs text-gray-500">complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getColorClasses(path.color)} transition-all duration-500`}
                style={{ width: `${path.progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Next: </span>
                <span className="font-medium text-gray-900">{path.nextCourse}</span>
              </div>
              <span className="text-orange-600 font-medium">{path.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;