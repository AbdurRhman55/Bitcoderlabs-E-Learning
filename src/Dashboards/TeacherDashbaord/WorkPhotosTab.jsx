// components/tabs/WorkPhotosTab.jsx
import React from 'react';
import { FaImage, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

const WorkPhotosTab = ({ workPics, setWorkPics, showNotification }) => {
    const handleWorkPicUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`${file.name} is too large (max 5MB)`, 'error');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newId = workPics.length > 0
                    ? Math.max(...workPics.map(item => item.id)) + 1
                    : 1;
                setWorkPics(prev => [
                    ...prev,
                    {
                        id: newId,
                        url: event.target.result,
                        caption: `Work Image ${newId}`,
                        fileName: file.name
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });

        showNotification(`${validFiles.length} image(s) uploaded successfully!`, 'success');
    };

    const updateWorkPicCaption = (id, caption) => {
        setWorkPics(workPics.map(item =>
            item.id === id ? { ...item, caption } : item
        ));
    };

    const removeWorkPic = (id) => {
        setWorkPics(workPics.filter(item => item.id !== id));
        showNotification('Work image removed', 'info');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-light">
                    <FaImage className="text-2xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Work Photos</h2>
                    <p className="text-gray-600">Upload images of your classroom, projects, or teaching activities</p>
                </div>
            </div>

            <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary-light/10 transition-all group">
                    <FaCloudUploadAlt className="text-4xl mb-4 text-primary group-hover:scale-110 transition-transform" />
                    <p className="text-gray-700 font-medium text-lg">Click to upload work photos</p>
                    <p className="text-gray-500 mt-1">Upload multiple JPG, PNG files up to 5MB each</p>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleWorkPicUpload}
                    />
                </label>
            </div>

            {workPics.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {workPics.map((pic) => (
                            <div key={pic.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={pic.url}
                                        alt={pic.caption}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={() => removeWorkPic(pic.id)}
                                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove photo"
                                    >
                                        <FaTrash className="text-xs" />
                                    </button>
                                </div>
                                <div className="p-4 bg-white">
                                    <input
                                        type="text"
                                        value={pic.caption}
                                        onChange={(e) => updateWorkPicCaption(pic.id, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                                        placeholder="Add a caption..."
                                    />
                                    {pic.fileName && (
                                        <p className="text-xs text-gray-500 mt-2 truncate">{pic.fileName}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center py-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">
                            {workPics.length} photo{workPics.length !== 1 ? 's' : ''} uploaded
                        </span>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                    <FaImage className="text-5xl mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No work photos yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Upload images to showcase your teaching environment and activities
                    </p>
                </div>
            )}
        </div>
    );
};

export default WorkPhotosTab;