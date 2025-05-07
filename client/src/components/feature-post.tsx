import { useState } from 'react';
import { Post, User as UserType } from '@shared/schema';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MapPin,
  User,
  MoreHorizontal
} from 'lucide-react';
import { useApp } from '../lib/api_context';
import { apiRequestJson } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Define extended Post type that includes author information
interface PostWithAuthor extends Post {
  author?: UserType;
}

interface FeaturePostProps {
  post: PostWithAuthor;
  onViewDetails?: (post: PostWithAuthor) => void;
}

export default function FeaturePost({ post, onViewDetails }: FeaturePostProps) {
  const { currentUser } = useApp();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const { mutate: likePost } = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequestJson(`/api/posts/${postId}/like`, 'POST');
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser?.id}/posts`] });
    }
  });

  const handleLike = () => {
    if (!currentUser) return;
    likePost(post.id);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(post);
    }
  };

  // Format date in a friendly way
  const formatDate = (dateValue: Date | string) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <User className="text-primary" size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold">
            {post.author?.displayName || post.author?.username || 'Anonymous'}
          </div>
          {post.location && (
            <div className="text-xs text-gray-500 flex items-center">
              <MapPin size={10} className="mr-1" />
              {post.location}
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            <MoreHorizontal size={20} />
          </button>
          
          {isOptionsOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white shadow-md rounded-md z-10 w-48">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 text-sm flex items-center cursor-pointer">
                  <Share size={14} className="mr-2" />
                  Share
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 text-sm flex items-center cursor-pointer">
                  <Bookmark size={14} className="mr-2" />
                  Save
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 text-sm flex items-center cursor-pointer">
                  <MapPin size={14} className="mr-2" />
                  Show on Map
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Post Image */}
      <div 
        className="relative cursor-pointer"
        onClick={handleViewDetails}
      >
        {post.mediaUrl ? (
          <img 
            src={post.mediaUrl} 
            alt={post.content || "Post image"} 
            className="w-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        ) : (
          <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex space-x-4">
            <button 
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-800'}`}
              onClick={handleLike}
            >
              <Heart 
                size={24} 
                className={`mr-1 ${isLiked ? 'fill-current' : ''}`} 
              />
              <span className="text-sm">{post.likes || 0}</span>
            </button>
            <button className="text-gray-800" onClick={handleViewDetails}>
              <MessageCircle size={24} />
            </button>
            <button className="text-gray-800">
              <Share size={24} />
            </button>
          </div>
          <button className="text-gray-800">
            <Bookmark size={24} />
          </button>
        </div>
        
        {/* Post Content */}
        {post.content && (
          <div className="mb-3">
            <p className="text-sm">
              <span className="font-semibold mr-2">
                {post.author?.displayName || post.author?.username || 'Anonymous'}
              </span>
              {post.content}
            </p>
          </div>
        )}
        
        {/* Post Date */}
        <div className="text-xs text-gray-500">
          {formatDate(post.createdAt)}
        </div>
      </div>
    </div>
  );
}