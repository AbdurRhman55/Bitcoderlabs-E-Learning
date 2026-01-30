import React, { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmit(comment);
            setComment('');
        }
    };

    return (
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-primary font-semibold mb-2">Add a comment</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                    >
                        Post Comment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
