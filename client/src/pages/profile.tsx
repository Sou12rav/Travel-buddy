import { useState, useRef, ChangeEvent } from "react";
import { useApp } from "../lib/api_context";
import { 
  User, 
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
import { Post } from "@shared/schema";
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
  const [mediaUpload, setMediaUpload] = useState<MediaUpload | null>(null);
  const [postCaption, setPostCaption] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch user posts
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: [`/api/users/${currentUser?.id}/posts`],
    enabled: !!currentUser,
  });
  
  const posts = postsData?.posts || [];
  
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

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Please sign in</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-poppins font-semibold text-dark text-lg">My Profile</h1>
          <div className="flex items-center space-x-2">
            <button className="text-gray-600">
              <Plus size={24} />
            </button>
            <button className="text-gray-600">
              <Settings size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Info */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mr-4 relative">
            <User className="text-primary" size={32} />
            <button className="absolute right-0 bottom-0 bg-primary text-white p-1 rounded-full">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="font-poppins font-semibold text-lg">
              {currentUser.displayName || currentUser.username}
            </h2>
            <p className="text-medium text-sm">{currentUser.email}</p>
            <button className="mt-1 text-primary text-sm font-medium">Edit Profile</button>
          </div>
        </div>
        
        <div className="flex justify-between mt-6 text-center">
          <div className="flex-1">
            <div className="font-semibold">{posts.length}</div>
            <div className="text-gray-500 text-sm">Posts</div>
          </div>
          <div className="flex-1">
            <div className="font-semibold">148</div>
            <div className="text-gray-500 text-sm">Followers</div>
          </div>
          <div className="flex-1">
            <div className="font-semibold">256</div>
            <div className="text-gray-500 text-sm">Following</div>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="bg-white">
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white border-b">
            <TabsTrigger value="posts" className="data-[state=active]:text-primary">
              <Grid size={20} />
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:text-primary">
              <BookmarkIcon size={20} />
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:text-primary">
              <Settings size={20} />
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
                    className="aspect-square bg-gray-100 relative overflow-hidden"
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
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  id="location" 
                  placeholder="Add location"
                  className="pl-10"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
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
    </div>
  );
}
