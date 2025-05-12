import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Post, User as UserType } from '@shared/schema';
import { useApp } from '../lib/api_context';
import FeaturePost from '@/components/feature-post';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Heart, 
  MessageCircle, 
  Share, 
  MapPin, 
  Bookmark 
} from 'lucide-react';

// Define extended Post type that includes author information
interface PostWithAuthor extends Post {
  author?: UserType;
}

export default function Feed() {
  const { currentUser } = useApp();
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [comment, setComment] = useState('');

  const { data: feedData, isLoading } = useQuery<{posts: PostWithAuthor[]}>({
    queryKey: [`/api/feed/${currentUser?.id}`],
    enabled: !!currentUser,
  });

  const handleViewPost = (post: PostWithAuthor) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  const handleAddComment = () => {
    if (!comment.trim() || !selectedPost) return;
    
    // In a real app, you would submit this to an API
    console.log('Adding comment to post', selectedPost.id, comment);
    
    setComment('');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading feed...</p>
        </div>
      </div>
    );
  }

  const posts = feedData?.posts || [];

  return (
    <div className="flex-1 overflow-y-auto pb-16 px-4">
      <header className="sticky top-0 bg-background dark:bg-background pt-4 pb-2 z-10">
        <h1 className="font-poppins font-semibold text-xl text-foreground">Explore</h1>
      </header>

      {posts.length > 0 ? (
        <div className="mt-2">
          {posts.map((post: PostWithAuthor) => (
            <FeaturePost
              key={post.id}
              post={post}
              onViewDetails={handleViewPost}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No posts in your feed yet</p>
            <p className="text-sm text-muted-foreground/80">Follow more users to see their travel updates</p>
          </div>
        </div>
      )}

      {/* Post Detail Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh]">
          {selectedPost && (
            <div className="flex flex-col">
              <div className="flex items-center p-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <User className="text-primary" size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">
                    {selectedPost.author?.displayName || selectedPost.author?.username || 'Anonymous'}
                  </div>
                  {selectedPost.location && (
                    <div className="text-xs text-muted-foreground flex items-center">
                      <MapPin size={10} className="mr-1" />
                      {selectedPost.location}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-muted overflow-hidden" style={{ maxHeight: '60vh' }}>
                {selectedPost.mediaType === 'video' ? (
                  <video 
                    src={selectedPost.mediaUrl || ''} 
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  ></video>
                ) : (
                  <img 
                    src={selectedPost.mediaUrl || ''} 
                    alt={selectedPost.content || "Post"} 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              <div className="p-3">
                <div className="flex justify-between mb-3">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-foreground">
                      <Heart size={24} className="mr-1" />
                      <span className="text-sm">{selectedPost.likes || 0}</span>
                    </button>
                    <button className="text-foreground">
                      <MessageCircle size={24} />
                    </button>
                    <button className="text-foreground">
                      <Share size={24} />
                    </button>
                  </div>
                  <button className="text-foreground">
                    <Bookmark size={24} />
                  </button>
                </div>
                
                {selectedPost.content && (
                  <div className="mb-3">
                    <p className="text-sm">
                      <span className="font-semibold mr-2">
                        {selectedPost.author?.displayName || selectedPost.author?.username || 'Anonymous'}
                      </span>
                      {selectedPost.content}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center">
                    <Input 
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm border-none focus:ring-0 bg-transparent"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <Button 
                      variant="ghost"
                      className="text-primary text-sm font-semibold"
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}