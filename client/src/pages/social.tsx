import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useApp } from "@/lib/api_context";
import { Post, Comment, User } from "@/lib/types";
import { ArrowLeft, Heart, MessageCircle, Share, MoreVertical, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Post Card Component
function PostCard({ post, onLike, onComment }: { 
  post: Post, 
  onLike: (postId: number) => void,
  onComment: (postId: number, content: string) => void 
}) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { currentUser } = useApp();
  
  // Get the user who created the post
  const { data: userData } = useQuery({
    queryKey: ['/api/users', post.userId],
    queryFn: () => apiRequest<{ user: User }>(`/api/users/${post.userId}`),
    enabled: !!post.userId
  });
  
  // Get comments for the post
  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ['/api/posts', post.id, 'comments'],
    queryFn: () => apiRequest<{ comments: Comment[] }>(`/api/posts/${post.id}/comments`),
    enabled: showComments
  });
  
  const handleCommentSubmit = () => {
    if (comment.trim() && currentUser) {
      onComment(post.id, comment);
      setComment("");
      refetchComments();
    }
  };
  
  const user = userData?.user;
  const comments = commentsData?.comments || [];
  const isVideo = post.mediaType === 'video';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            {/* Avatar placeholder */}
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <h3 className="font-medium">{user?.displayName || 'Unknown User'}</h3>
            <p className="text-xs text-gray-500">{post.location || 'Unknown Location'}</p>
          </div>
        </div>
        <button className="text-gray-500">
          <MoreVertical size={20} />
        </button>
      </div>
      
      {/* Post Media */}
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
        {post.mediaUrl ? (
          isVideo ? (
            <video 
              className="w-full h-full object-cover" 
              src={post.mediaUrl} 
              controls
            />
          ) : (
            <img 
              className="w-full h-full object-cover" 
              src={post.mediaUrl} 
              alt={post.content || 'Post image'} 
            />
          )
        ) : (
          <div className="text-gray-400">No media</div>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="p-4 flex justify-between">
        <div className="flex space-x-4">
          <button 
            className="flex items-center space-x-1 text-gray-700"
            onClick={() => onLike(post.id)}
          >
            <Heart size={20} className="text-red-500" />
            <span>{post.likes || 0}</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-gray-700"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </button>
        </div>
        <button className="text-gray-700">
          <Share size={20} />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-sm">{post.content}</p>
      </div>
      
      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-2">
          <h4 className="text-sm font-medium mb-2">Comments</h4>
          
          {comments.length > 0 ? (
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-2 text-sm">
                  <span className="font-medium">User:</span>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No comments yet</p>
          )}
          
          {/* Add Comment */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border rounded-full px-3 py-1 text-sm"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <button 
              className="text-primary" 
              onClick={handleCommentSubmit}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// New Post Form Component
function NewPostForm({ onSubmit }: { onSubmit: (post: any) => void }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      content,
      mediaUrl,
      mediaType,
      location
    });
    setContent("");
    setMediaUrl("");
    setLocation("");
    setIsOpen(false);
  };
  
  return (
    <div className="mb-4">
      {!isOpen ? (
        <button 
          className="w-full py-2 bg-primary text-white rounded-lg font-medium"
          onClick={() => setIsOpen(true)}
        >
          Create New Post
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-medium mb-3">Create New Post</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">What's on your mind?</label>
                <textarea 
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your travel experience..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Media URL (image or video)</label>
                <input 
                  type="url"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Media Type</label>
                <select
                  className="w-full border rounded-lg p-2 text-sm"
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as "image" | "video")}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input 
                  type="text"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Victoria Memorial, Kolkata"
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  type="button"
                  className="flex-1 py-2 border border-gray-300 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-lg"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Main Social Page Component
export default function Social() {
  const [, navigate] = useLocation();
  const { currentUser } = useApp();
  
  // Fetch feed posts for the current user
  const { data: feedData, refetch: refetchFeed } = useQuery({
    queryKey: ['/api/feed', currentUser?.id],
    queryFn: () => apiRequest<{ posts: Post[] }>(`/api/feed/${currentUser?.id}`),
    enabled: !!currentUser?.id
  });
  
  const posts = feedData?.posts || [];
  
  // Create a new post
  const createPost = async (postData: any) => {
    if (!currentUser) return;
    
    try {
      await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          ...postData
        })
      });
      
      refetchFeed();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  
  // Like a post
  const likePost = async (postId: number) => {
    try {
      await apiRequest(`/api/posts/${postId}/like`, {
        method: 'POST'
      });
      
      refetchFeed();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };
  
  // Comment on a post
  const commentOnPost = async (postId: number, content: string) => {
    if (!currentUser) return;
    
    try {
      await apiRequest('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          postId,
          userId: currentUser.id,
          content
        })
      });
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };
  
  return (
    <div className="flex-1 overflow-hidden">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="mr-2">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-poppins font-semibold text-dark text-lg">Travel Social</h1>
              <p className="text-medium text-sm">Connect with other travelers</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100%-56px)] overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {/* New Post Form */}
          <NewPostForm onSubmit={createPost} />
          
          {/* Feed */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={likePost}
                  onComment={commentOnPost}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 mb-3">No posts in your feed yet.</p>
                <p className="text-sm">Create a post or connect with friends to see their travel experiences!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}