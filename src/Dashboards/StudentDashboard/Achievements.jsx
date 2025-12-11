// components/Achievements.jsx
import React from 'react';
import { FaBolt, FaRegCheckCircle, FaRunning, FaFeather, FaBullseye } from 'react-icons/fa';
import { GiButterfly } from 'react-icons/gi';


const Achievements = () => {
  const achievements = [
    {
      id: 1,
      name: 'Quick Learner',
      description: 'Complete 5 courses within 30 days',
      icon: <FaBolt className="mx-auto text-4xl text-yellow-400" />,
      earned: true,
      date: '2024-01-20',
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: <FaRegCheckCircle className="mx-auto text-4xl text-green-500" />,
      earned: true,
      date: '2024-01-15',
      rarity: 'rare'
    },
    {
      id: 3,
      name: 'Marathon Runner',
      description: 'Complete 20 hours of learning',
      icon: <FaRunning className="mx-auto text-4xl text-blue-500" />,
      earned: false,
      progress: 65,
      rarity: 'common'
    },
    {
      id: 4,
      name: 'Early Bird',
      description: 'Complete a course before deadline',
      icon: <FaFeather className="mx-auto text-4xl text-purple-400" />,
      earned: false,
      progress: 30,
      rarity: 'uncommon'
    },
    {
      id: 5,
      name: 'Social Butterfly',
      description: 'Join 3 study groups',
      icon: <GiButterfly className="mx-auto text-4xl text-pink-400" />,
      earned: true,
      date: '2024-02-01',
      rarity: 'uncommon'
    },
    {
      id: 6,
      name: 'Master Collector',
      description: 'Earn 10 different achievements',
      icon: <FaBullseye className="mx-auto text-4xl text-red-500" />,
      earned: false,
      progress: 40,
      rarity: 'rare'
    }
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      uncommon: 'border-green-300 bg-green-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50'
    };
    return colors[rarity] || colors.common;
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-1">Unlock badges and showcase your progress</p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{earnedCount}</div>
          <div className="text-sm text-gray-600">Unlocked</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">{totalCount}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{Math.round((earnedCount / totalCount) * 100)}%</div>
          <div className="text-sm text-gray-600">Completion</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              rounded-xl p-6 border-2 transition-all duration-300
              ${achievement.earned
                ? getRarityColor(achievement.rarity) + ' transform hover:scale-105'
                : 'border-gray-200 bg-white opacity-60'
              }
            `}
          >
            <div className="text-center">
              <div className="mb-4">{achievement.icon}</div>
              <h3 className={`font-semibold mb-2 ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

              {achievement.earned ? (
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Earned
                  </span>
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.progress}% complete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
