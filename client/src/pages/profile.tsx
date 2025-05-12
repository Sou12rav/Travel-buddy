import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useApp } from "../lib/api_context";
import { 
  User as UserIcon, 
  Bell, 
  Moon, 
  Globe, 
  Clock, 
  Bookmark, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Camera,
  Grid,
  Bookmark as BookmarkIcon,
  Heart,
  MessageCircle,
  Film,
  Image as ImageIcon,
  Share,
  Plus,
  X,
  Settings,
  Upload,
  MapPin
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post, type User as UserType } from "@shared/schema";
import { apiRequestJson } from "@/lib/queryClient";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Media upload interface
interface MediaUpload {
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function Profile() {
  const { currentUser, setCurrentUser } = useApp();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [notifications, setNotifications] = useState(
    currentUser?.preferences?.notifications ?? true
  );
  const [darkMode, setDarkMode] = useState(
    currentUser?.preferences?.darkMode ?? false
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewPostDialogOpen, setIsViewPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [mediaUpload, setMediaUpload] = useState<MediaUpload | null>(null);
  const [postCaption, setPostCaption] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
  
  // Fetch user posts
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: [`/api/users/${currentUser?.id}/posts`],
    enabled: !!currentUser,
  });
  
  // Fetch followers
  const { data: followersData, isLoading: isLoadingFollowers } = useQuery({
    queryKey: [`/api/users/${currentUser?.id}/followers`],
    enabled: !!currentUser,
  });
  
  // Fetch following
  const { data: followingData, isLoading: isLoadingFollowing } = useQuery({
    queryKey: [`/api/users/${currentUser?.id}/following`],
    enabled: !!currentUser,
  });
  
  const posts = postsData?.posts || [];
  const followers = followersData?.followers || [];
  const following = followingData?.following || [];
  const followerCount = followers.length;
  const followingCount = following.length;
  
  // Handle preference updates
  const { mutate: updatePreference } = useMutation({
    mutationFn: async (preferences: any) => {
      // In a real app, we would make an API call to update the user's preferences
      return { ...currentUser, preferences: { ...currentUser?.preferences, ...preferences } };
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser);
    }
  });
  
  // Handle post creation
  const { mutate: createPost } = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequestJson('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser?.id}/posts`] });
      setIsUploadDialogOpen(false);
      setMediaUpload(null);
      setPostCaption("");
      setPostLocation("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      setIsSubmitting(false);
    }
  });
  
  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    updatePreference({ notifications: checked });
  };
  
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    updatePreference({ darkMode: checked });
    
    // Toggle dark mode class on HTML element
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSignOut = () => {
    setCurrentUser(null);
  };
  
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const reader = new FileReader();
    
    reader.onload = () => {
      setMediaUpload({
        file,
        preview: reader.result as string,
        type: fileType
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleMediaUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmitPost = async () => {
    if (!mediaUpload || !currentUser) return;
    
    setIsSubmitting(true);
    
    // In a real app, you would upload the file to a storage service
    // and get back a URL. For this demo, we'll use the preview URL.
    const mediaUrl = mediaUpload.preview;
    
    createPost({
      userId: currentUser.id,
      content: postCaption,
      mediaUrl,
      mediaType: mediaUpload.type,
      location: postLocation || null
    });
  };
  
  // Handle liking a post
  const { mutate: likePost } = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequestJson(`/api/posts/${postId}/like`, {
        method: 'POST'
      });
    },
    onSuccess: (data, postId) => {
      setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
      
      // If we're viewing this post in detail, update it
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          likes: (selectedPost.likes || 0) + (likedPosts[postId] ? -1 : 1)
        });
      }
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser?.id}/posts`] });
    }
  });
  
  // Handle adding a comment to a post
  const { mutate: addComment } = useMutation({
    mutationFn: async ({ postId, content }: { postId: number, content: string }) => {
      return apiRequestJson(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser?.id,
          postId,
          content
        })
      });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser?.id}/posts`] });
    }
  });
  
  const handleAddComment = (postId: number) => {
    if (!comment.trim()) return;
    
    addComment({ postId, content: comment });
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Please sign in</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <header className="bg-card dark:bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-poppins font-semibold text-foreground text-lg">My Profile</h1>
          <div className="flex items-center space-x-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="New post">
                  <Plus size={22} className="text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>Share your travel experience with others!</p>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full relative border-primary/20 dark:border-primary/40 bg-background dark:bg-background">
                  <Settings size={20} className="text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="py-2 space-y-4">
                  {/* Settings Items */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="text-muted-foreground mr-3" size={18} />
                      <span>Notifications</span>
                    </div>
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={handleNotificationsChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="text-muted-foreground mr-3" size={18} />
                      <span>Dark Mode</span>
                    </div>
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={handleDarkModeChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="text-muted-foreground mr-3" size={18} />
                      <span>Language</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <span className="mr-2">
                        {currentUser.preferences?.language || "English"}
                      </span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 text-destructive border-destructive/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Profile Info */}
      <section className="px-4 py-6 bg-card dark:bg-card border-b border-border">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 flex items-center justify-center mr-5 relative shadow-md">
            <UserIcon className="text-primary dark:text-primary/90" size={32} />
            <button className="absolute right-0 bottom-0 bg-primary dark:bg-primary/90 text-white p-1.5 rounded-full shadow-sm hover:bg-primary/90 transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="font-poppins font-semibold text-foreground text-xl">
              {currentUser.displayName || currentUser.username}
            </h2>
            <p className="text-muted-foreground text-sm">{currentUser.email}</p>
            <Button variant="ghost" size="sm" className="mt-1 px-3 py-1 h-8 text-primary hover:bg-primary/5 dark:hover:bg-primary/10">
              Edit Profile
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between mt-8 text-center">
          <div className="flex-1 p-2 hover:bg-muted/40 rounded-md transition-colors">
            <div className="font-semibold text-foreground">{posts.length}</div>
            <div className="text-muted-foreground text-sm">Posts</div>
          </div>
          <div 
            className="flex-1 p-2 hover:bg-muted/40 rounded-md transition-colors cursor-pointer" 
            onClick={() => setIsFollowersDialogOpen(true)}
          >
            <div className="font-semibold text-foreground">{followerCount || 0}</div>
            <div className="text-muted-foreground text-sm">Followers</div>
          </div>
          <div 
            className="flex-1 p-2 hover:bg-muted/40 rounded-md transition-colors cursor-pointer" 
            onClick={() => setIsFollowingDialogOpen(true)}
          >
            <div className="font-semibold text-foreground">{followingCount || 0}</div>
            <div className="text-muted-foreground text-sm">Following</div>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="bg-card dark:bg-card">
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-card dark:bg-card border-b border-border">
            <TabsTrigger value="posts" className="data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none">
              <Grid size={18} className="mr-2" />
              <span className="text-sm">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none">
              <BookmarkIcon size={18} className="mr-2" />
              <span className="text-sm">Saved</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            {isLoadingPosts ? (
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-gray-100 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post: Post) => (
                  <div 
                    key={post.id} 
                    className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setIsViewPostDialogOpen(true);
                    }}
                  >
                    {post.mediaUrl ? (
                      <>
                        {post.mediaType === 'video' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Film className="text-white drop-shadow-md" size={24} />
                          </div>
                        ) : null}
                        <img 
                          src={post.mediaUrl} 
                          alt={post.content || "Post"} 
                          className="object-cover w-full h-full"
                        />
                        {/* Location Tag */}
                        {post.location && (
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-md flex items-center">
                            <MapPin size={10} className="mr-1" />
                            <span className="line-clamp-1">{post.location}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Camera className="text-gray-400" size={24} />
                </div>
                <h3 className="font-medium mb-2">No Posts Yet</h3>
                <p className="text-gray-500 text-sm mb-4">Share your travel moments with friends</p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Post
                </Button>
              </div>
            )}
            
            {/* Floating action button for adding new posts */}
            {posts.length > 0 && (
              <div className="fixed bottom-20 right-4">
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="rounded-full w-14 h-14 shadow-lg"
                >
                  <Plus size={24} />
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0">
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <BookmarkIcon className="text-gray-400" size={24} />
              </div>
              <h3 className="font-medium mb-2">No Saved Posts</h3>
              <p className="text-gray-500 text-sm">Save posts to view them later</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            {/* Settings List */}
            <div className="divide-y">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="text-medium mr-3" size={20} />
                  <span>Notifications</span>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="text-medium mr-3" size={20} />
                  <span>Dark Mode</span>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={handleDarkModeChange}
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="text-medium mr-3" size={20} />
                  <span>Language</span>
                </div>
                <div className="flex items-center">
                  <span className="text-medium mr-2">
                    {currentUser.preferences?.language || "English"}
                  </span>
                  <ChevronRight className="text-medium" size={16} />
                </div>
              </div>
            </div>
            
            {/* Account Settings */}
            <div className="mt-4 divide-y">
              <div className="px-4 py-3 border-t">
                <h3 className="font-medium text-medium">Account</h3>
              </div>
              <div className="px-4 py-3 flex items-center">
                <Clock className="text-medium mr-3" size={20} />
                <span>Travel History</span>
                <ChevronRight className="text-medium ml-auto" size={16} />
              </div>
              <div className="px-4 py-3 flex items-center">
                <Bookmark className="text-medium mr-3" size={20} />
                <span>Saved Places</span>
                <ChevronRight className="text-medium ml-auto" size={16} />
              </div>
              <div className="px-4 py-3 flex items-center">
                <CreditCard className="text-medium mr-3" size={20} />
                <span>Payment Methods</span>
                <ChevronRight className="text-medium ml-auto" size={16} />
              </div>
              <div 
                className="px-4 py-3 flex items-center"
                onClick={handleSignOut}
              >
                <LogOut className="text-red-500 mr-3" size={20} />
                <span className="text-red-500">Sign Out</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Media upload dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {!mediaUpload ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer"
                onClick={handleMediaUploadClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*" 
                  onChange={handleFileSelect}
                />
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500">
                    Support for images and videos
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                  {mediaUpload.type === 'video' ? (
                    <video 
                      src={mediaUpload.preview} 
                      className="w-full h-full object-cover"
                      controls
                    ></video>
                  ) : (
                    <img 
                      src={mediaUpload.preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button 
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
                  onClick={() => setMediaUpload(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea 
                id="caption" 
                placeholder="Write a caption..."
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Add a location"
                value={postLocation}
                onChange={(e) => setPostLocation(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPost}
              disabled={!mediaUpload || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Share"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Post view dialog */}
      <Dialog open={isViewPostDialogOpen} onOpenChange={setIsViewPostDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh]">
          {selectedPost && (
            <div className="flex flex-col">
              <div className="flex items-center p-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <UserIcon className="text-primary" size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">
                    {currentUser?.displayName || currentUser?.username}
                  </div>
                  {selectedPost.location && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <MapPin size={10} className="mr-1" />
                      {selectedPost.location}
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Three-dot menu options */}
                  <div className="absolute right-0 top-full mt-1 bg-white shadow-md rounded-md hidden group-hover:block z-10 w-48">
                    <ul className="py-1">
                      <li className="px-4 py-2 hover:bg-gray-100 text-sm flex items-center cursor-pointer">
                        <Share size={14} className="mr-2" />
                        Share
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 text-sm flex items-center cursor-pointer">
                        <BookmarkIcon size={14} className="mr-2" />
                        Save
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 text-sm flex items-center cursor-pointer">
                        <MapPin size={14} className="mr-2" />
                        Show on Map
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 overflow-hidden" style={{ maxHeight: '60vh' }}>
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
                    <button 
                      className={`flex items-center ${likedPosts[selectedPost.id] ? 'text-red-500' : 'text-gray-800'}`}
                      onClick={() => likePost(selectedPost.id)}
                    >
                      <Heart 
                        size={24} 
                        className={`mr-1 ${likedPosts[selectedPost.id] ? 'fill-current' : ''}`} 
                      />
                      <span className="text-sm">{selectedPost.likes || 0}</span>
                    </button>
                    <button className="text-gray-800">
                      <MessageCircle size={24} />
                    </button>
                    <button className="text-gray-800">
                      <Share size={24} />
                    </button>
                  </div>
                  <button className="text-gray-800">
                    <BookmarkIcon size={24} />
                  </button>
                </div>
                
                {selectedPost.content && (
                  <div className="mb-3">
                    <p className="text-sm">
                      <span className="font-semibold mr-2">
                        {currentUser?.displayName || currentUser?.username}
                      </span>
                      {selectedPost.content}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex">
                    <input 
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm border-none focus:ring-0 bg-transparent"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                    />
                    <button 
                      className="text-primary text-sm font-semibold"
                      onClick={() => handleAddComment(selectedPost.id)}
                      disabled={!comment.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Followers Dialog */}
      <Dialog open={isFollowersDialogOpen} onOpenChange={setIsFollowersDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Followers</DialogTitle>
          </DialogHeader>
          
          <div className="mt-2">
            {isLoadingFollowers ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : followers.length > 0 ? (
              <div className="space-y-3">
                {followers.map((user: UserType) => (
                  <div key={user.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || user.username}</p>
                        <p className="text-gray-500 text-xs">{user.username}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full px-4"
                    >
                      Follow Back
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No followers yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Following Dialog */}
      <Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Following</DialogTitle>
          </DialogHeader>
          
          <div className="mt-2">
            {isLoadingFollowing ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : following.length > 0 ? (
              <div className="space-y-3">
                {following.map((user: UserType) => (
                  <div key={user.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || user.username}</p>
                        <p className="text-gray-500 text-xs">{user.username}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full px-4"
                    >
                      Following
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Not following anyone yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}