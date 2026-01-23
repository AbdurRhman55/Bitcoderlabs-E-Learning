import React, { useState } from 'react';
import CommentForm from './CommentForm';

const Comment = ({ comment, onReply }) => {
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText('');
            setShowReplyForm(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h5 className="font-semibold text-gray-800">{comment.name}</h5>
                    <p className="text-sm text-gray-500">{comment.time}</p>
                </div>
                <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-primary text-sm hover:text-primary"
                >
                    Reply
                </button>
            </div>
            <p className="text-gray-700">{comment.comment}</p>

            {/* Reply Form */}
            {showReplyForm && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            rows="2"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowReplyForm(false)}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-primary text-white rounded-md"
                            >
                                Post Reply
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                    {comment.replies.map((reply, index) => (
                        <div key={index} className="pt-2">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h6 className="font-medium text-gray-800 text-sm">{reply.name}</h6>
                                    <p className="text-xs text-gray-500">{reply.time}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentsSection = ({ comments: initialComments }) => {
    const [comments, setComments] = useState(initialComments);

    const handleNewComment = (commentText) => {
        const newComment = {
            id: comments.length + 1,
            name: "You", // In real app, this would come from user authentication
            time: "Just now",
            comment: commentText,
            replies: []
        };
        setComments([newComment, ...comments]);
    };

    const handleReply = (commentId, replyText) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                const newReply = {
                    name: "You",
                    time: "Just now",
                    comment: replyText
                };
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        }));
    };

    return (
        <div>
            <CommentForm onSubmit={handleNewComment} />

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;