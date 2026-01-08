// src/components/DashboardSkeleton.jsx
import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-gray-100">
                                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>

            {/* Main content skeleton (Profile + Activities) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile skeleton - lg:col-span-2 */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start space-x-6">
                            {/* Profile image skeleton */}
                            <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg"></div>
                            
                            {/* Profile info skeleton */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-2">
                                        <div className="h-7 bg-gray-300 rounded w-1/3"></div>
                                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                                </div>

                                {/* About section skeleton */}
                                <div className="space-y-2 mb-6">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>

                                {/* Stats row skeleton */}
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center">
                                        <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>

                                {/* Skills skeleton */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                                        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                                        <div className="h-8 bg-gray-200 rounded-full w-28"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
                    
                    {/* Activities list skeleton */}
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3">
                                <div className="p-2 rounded-lg bg-gray-100">
                                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* View all button skeleton */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>

            {/* Quick Actions skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl">
                            <div className="h-8 w-8 bg-gray-300 rounded-full mb-3"></div>
                            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;