import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useApp } from "@/lib/api_context";
import { Post, Comment, User } from "@/lib/types";
import { 
  ArrowLeft, Heart, MessageCircle, Share, MoreVertical, 
  Send, UserPlus, UserMinus, Users, User as UserIcon,
  PlusCircle, MapPin, Calendar, Bookmark, 
  ImagePlus, Map, MessageSquare, Link
} from "lucide-react";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

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
    queryKey: [`/api/users/${post.userId}`],
    enabled: !!post.userId
  });
  
  // Get comments for the post
  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: [`/api/posts/${post.id}/comments`],
    enabled: showComments
  });
  
  const handleCommentSubmit = () => {
    if (comment.trim() && currentUser) {
      onComment(post.id, comment);
      setComment("");
      refetchComments();
    }
  };
  
  // Type assertion to handle the response format
  const userData1 = userData as { user?: User } | undefined;
  const commentsData1 = commentsData as { comments?: Comment[] } | undefined;
  
  const user = userData1?.user;
  const comments = commentsData1?.comments || [];
  const isVideo = post.mediaType === 'video';

  return (
    <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            {/* Avatar placeholder */}
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <h3 className="font-medium">{user?.displayName || 'Unknown User'}</h3>
            <p className="text-xs text-muted-foreground">{post.location || 'Unknown Location'}</p>
          </div>
        </div>
        <PostOptionsMenu 
          postId={post.id} 
          userId={post.userId} 
          post={post}
        />
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
          <div className="text-muted-foreground">No media</div>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="p-4 flex justify-between">
        <div className="flex space-x-4">
          <button 
            className="flex items-center space-x-1 text-foreground"
            onClick={() => onLike(post.id)}
          >
            <Heart size={20} className="text-red-500" />
            <span>{post.likes || 0}</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </button>
        </div>
        <button className="text-foreground">
          <Share size={20} />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-sm">{post.content}</p>
        
        {/* Tagged Place */}
        {post.placeId && post.placeDetails && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-medium">Tagged Place</span>
                <span className="text-sm font-medium">{post.placeDetails.name}</span>
                <span className="text-xs text-muted-foreground">{post.placeDetails.address}</span>
              </div>
              <AddToItineraryButton 
                placeId={post.placeId} 
                placeDetails={post.placeDetails}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-muted pt-2">
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
            <p className="text-sm text-muted-foreground mb-3">No comments yet</p>
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
  const [placeId, setPlaceId] = useState("");
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [showPlaceTagging, setShowPlaceTagging] = useState(false);
  
  // Example place options that would ideally come from an API
  const placeOptions = [
    { id: "place1", name: "Victoria Memorial", type: "attraction", address: "Victoria Memorial, Kolkata", location: "Kolkata" },
    { id: "place2", name: "Howrah Bridge", type: "landmark", address: "Howrah Bridge, Kolkata", location: "Kolkata" },
    { id: "place3", name: "Park Street", type: "area", address: "Park Street, Kolkata", location: "Kolkata" }
  ];
  
  const handleSelectPlace = (place: any) => {
    setPlaceId(place.id);
    setPlaceDetails(place);
    setLocation(place.address);
    setShowPlaceTagging(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      content,
      mediaUrl,
      mediaType,
      location,
      placeId: placeId || undefined,
      placeDetails: placeDetails || undefined
    });
    setContent("");
    setMediaUrl("");
    setLocation("");
    setPlaceId("");
    setPlaceDetails(null);
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
        <div className="bg-card dark:bg-card rounded-lg shadow-md p-4">
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
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    className="flex-1 border rounded-lg p-2 text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Victoria Memorial, Kolkata"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm"
                    onClick={() => setShowPlaceTagging(!showPlaceTagging)}
                  >
                    Tag Place
                  </button>
                </div>
                
                {showPlaceTagging && (
                  <div className="mt-2 border rounded-lg p-3 bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">Select a place to tag</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {placeOptions.map(place => (
                        <div 
                          key={place.id}
                          className={`p-2 rounded-lg cursor-pointer ${place.id === placeId ? 'bg-blue-100 dark:bg-blue-900' : 'bg-card border dark:border-muted'}`}
                          onClick={() => handleSelectPlace(place)}
                        >
                          <div className="font-medium text-sm">{place.name}</div>
                          <div className="text-xs text-muted-foreground">{place.address}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {placeId && placeDetails && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">Tagged: </span>
                        <span>{placeDetails.name}</span>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 text-xs"
                        onClick={() => {
                          setPlaceId("");
                          setPlaceDetails(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
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

// Followers/Following Component
function FollowersSection({ userId }: { userId: number }) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useApp();
  
  // Fetch followers data
  const { data: followersData } = useQuery({
    queryKey: [`/api/users/${userId}/followers`],
    enabled: showModal && activeTab === 'followers'
  });
  
  // Fetch following data
  const { data: followingData } = useQuery({
    queryKey: [`/api/users/${userId}/following`],
    enabled: showModal && activeTab === 'following'
  });
  
  // Fetch is-following status for the current user
  const { data: isFollowingCurrentUser } = useQuery({
    queryKey: [`/api/follow-check?followerId=${currentUser?.id}&followingId=${userId}`],
    enabled: !!currentUser?.id && userId !== currentUser?.id
  });
  
  // Type assertion for response format
  const followersData1 = followersData as { users?: User[] } | undefined;
  const followingData1 = followingData as { users?: User[] } | undefined;
  const isFollowingData = isFollowingCurrentUser as { isFollowing?: boolean } | undefined;
  
  const followers = followersData1?.users || [];
  const following = followingData1?.users || [];
  const isFollowing = isFollowingData?.isFollowing || false;
  
  // Function to follow a user
  const followUser = async (followingId: number) => {
    if (!currentUser) return;
    
    try {
      await apiRequest(
        'POST',
        '/api/follow',
        {
          followerId: currentUser.id,
          followingId
        }
      );
      // Refetch followers/following data
      window.location.reload(); // Simple reload to update the UI
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };
  
  // Function to unfollow a user
  const unfollowUser = async (followingId: number) => {
    if (!currentUser) return;
    
    try {
      await apiRequest(
        'DELETE',
        `/api/unfollow?followerId=${currentUser.id}&followingId=${followingId}`
      );
      // Refetch followers/following data
      window.location.reload(); // Simple reload to update the UI
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex space-x-6">
          <button
            onClick={() => {
              setActiveTab('followers');
              setShowModal(true);
            }}
            className="flex items-center space-x-1"
          >
            <Users size={16} />
            <span className="text-sm font-medium">Followers</span>
            <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">{followers.length || 0}</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('following');
              setShowModal(true);
            }}
            className="flex items-center space-x-1"
          >
            <UserIcon size={16} />
            <span className="text-sm font-medium">Following</span>
            <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">{following.length || 0}</span>
          </button>
        </div>
        
        {userId !== currentUser?.id && (
          <button
            onClick={() => isFollowing ? unfollowUser(userId) : followUser(userId)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
              isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'
            }`}
          >
            {isFollowing ? (
              <>
                <UserMinus size={16} />
                <span>Unfollow</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Follow</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card dark:bg-card rounded-lg w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-4 border-b dark:border-muted">
              <h3 className="font-medium">{activeTab === 'followers' ? 'Followers' : 'Following'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground">
                &times;
              </button>
            </div>
            
            <div className="p-4 max-h-80 overflow-y-auto">
              {activeTab === 'followers' ? (
                followers.length > 0 ? (
                  followers.map(user => (
                    <div key={user.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                      
                      {/* Follow/Unfollow button would go here */}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No followers yet</p>
                )
              ) : (
                following.length > 0 ? (
                  following.map(user => (
                    <div key={user.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                      
                      {/* Follow/Unfollow button would go here */}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Not following anyone yet</p>
                )
              )}
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-gray-100 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// PostOptionsMenu Component 
function PostOptionsMenu({ postId, userId, post }: { postId: number, userId: number, post: Post }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const { currentUser } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside of the menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  // Function to save post
  const savePost = async () => {
    try {
      await apiRequest('POST', `/api/posts/${postId}/save`);
      alert("Post saved successfully!");
      setShowOptions(false);
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };
  
  // Function to copy link
  const copyLink = () => {
    const postLink = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postLink)
      .then(() => {
        alert("Link copied to clipboard!");
        setShowOptions(false);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  // Function to add to story
  const addToStory = () => {
    alert("Feature to add to story coming soon!");
    setShowOptions(false);
  };
  
  // Function to send direct message to post author
  const sendMessage = async () => {
    if (!currentUser) return;
    
    try {
      // Create a new conversation or get existing one
      const response = await apiRequest(
        'POST',
        '/api/conversations', 
        { userId: currentUser.id, otherUserId: userId }
      );
      
      const data = await response.json();
      
      alert("Redirecting to chat...");
      window.location.href = `/chat?conversation=${data.conversation.id}`;
    } catch (error) {
      console.error('Failed to initiate chat:', error);
    }
  };
  
  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="text-gray-500"
        onClick={() => setShowOptions(!showOptions)}
      >
        <MoreVertical size={20} />
      </button>
      
      {showOptions && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-20 w-56 py-1 text-sm">
          <button 
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
            onClick={savePost}
          >
            <Bookmark size={16} />
            <span>Save post</span>
          </button>
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
            onClick={addToStory}
          >
            <ImagePlus size={16} />
            <span>Add to your story</span>
          </button>
          
          {post.placeId && post.placeDetails && (
            <button 
              className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
              onClick={() => {
                setShowMapModal(true);
                setShowOptions(false);
              }}
            >
              <Map size={16} />
              <span>Show on map</span>
            </button>
          )}
          
          {userId !== currentUser?.id && (
            <button 
              className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
              onClick={sendMessage}
            >
              <MessageSquare size={16} />
              <span>Message</span>
            </button>
          )}
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
            onClick={copyLink}
          >
            <Link size={16} />
            <span>Copy link</span>
          </button>
        </div>
      )}
      
      {/* Map Modal */}
      {showMapModal && post.placeId && post.placeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">View on Map</h3>
              <button onClick={() => setShowMapModal(false)} className="text-gray-500">
                &times;
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium">{post.placeDetails.name}</h4>
                <p className="text-sm text-gray-500">{post.placeDetails.address}</p>
              </div>
              
              {/* Map Placeholder - would be replaced with actual map component */}
              <div className="bg-gray-200 rounded-lg h-60 flex items-center justify-center">
                <div className="text-center">
                  <Map size={48} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Map view would display here</p>
                  <p className="text-xs text-gray-400">Integration with maps coming soon</p>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => {
                    // Open in maps app or similar functionality
                    setShowMapModal(false);
                    alert("Opening in maps app coming soon!");
                  }}
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AddToItineraryButton Component
function AddToItineraryButton({ placeId, placeDetails }: { placeId?: string, placeDetails?: any }) {
  const [showModal, setShowModal] = useState(false);
  const [showCreateItineraryModal, setShowCreateItineraryModal] = useState(false);
  const [newItineraryTitle, setNewItineraryTitle] = useState("");
  const [newItineraryCity, setNewItineraryCity] = useState("");
  const [newItineraryDate, setNewItineraryDate] = useState("");
  const [newItineraryTime, setNewItineraryTime] = useState("08:00");
  const [newItineraryDuration, setNewItineraryDuration] = useState("3");
  const [newItineraryBudget, setNewItineraryBudget] = useState("");
  const [newItineraryNotes, setNewItineraryNotes] = useState("");
  const [newItineraryTransport, setNewItineraryTransport] = useState("flight");
  const [newItineraryAccommodation, setNewItineraryAccommodation] = useState("hotel");
  const { currentUser } = useApp();
  
  // Get user's itineraries
  const { data: itinerariesData } = useQuery({
    queryKey: [`/api/users/${currentUser?.id}/itineraries`],
    enabled: !!currentUser?.id && showModal
  });
  
  // Type assertion
  const itinerariesData1 = itinerariesData as { itineraries?: any[] } | undefined;
  const itineraries = itinerariesData1?.itineraries || [];
  
  // Add place to itinerary
  const addToItinerary = async (itineraryId: number) => {
    if (!currentUser || !placeId || !placeDetails) return;
    
    try {
      await apiRequest(
        'POST',
        `/api/users/${currentUser.id}/itineraries/${itineraryId}/add-place`,
        {
          placeId,
          placeDetails
        }
      );
      
      setShowModal(false);
      alert("Place added to itinerary successfully!");
    } catch (error) {
      console.error('Failed to add place to itinerary:', error);
      alert("Failed to add place to itinerary. Please try again.");
    }
  };
  
  return (
    <>
      <button 
        className="text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center space-x-1"
        onClick={() => setShowModal(true)}
      >
        <PlusCircle size={14} />
        <span>Add to Itinerary</span>
      </button>
      
      {/* Modal for adding to itinerary */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Add to Itinerary</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500">
                &times;
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MapPin className="text-blue-600 mt-1" size={16} />
                  <div>
                    <p className="font-medium text-sm">{placeDetails?.name}</p>
                    <p className="text-xs text-gray-500">{placeDetails?.address}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-4">Select an itinerary to add this place to:</p>
              
              {itineraries.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {itineraries.map(itinerary => (
                    <div 
                      key={itinerary.id}
                      className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => addToItinerary(itinerary.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{itinerary.title}</p>
                          <p className="text-xs text-gray-500">{itinerary.city} • {itinerary.date}</p>
                        </div>
                      </div>
                      <PlusCircle size={18} className="text-blue-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">No itineraries available</p>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setShowCreateItineraryModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Create New Itinerary
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-gray-100 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for creating new itinerary */}
      {showCreateItineraryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Create New Itinerary</h3>
              <button onClick={() => setShowCreateItineraryModal(false)} className="text-gray-500">
                &times;
              </button>
            </div>
            
            <div className="p-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                
                if (!currentUser) return;
                
                try {
                  // Create a new itinerary
                  // Prepare itinerary metadata with extended details
                  const itineraryMetadata = {
                    startTime: newItineraryTime,
                    duration: parseInt(newItineraryDuration),
                    budget: newItineraryBudget ? parseInt(newItineraryBudget) : null,
                    notes: newItineraryNotes,
                    transportation: newItineraryTransport,
                    accommodation: newItineraryAccommodation
                  };
                  
                  const response = await apiRequest(
                    'POST',
                    '/api/itineraries',
                    {
                      userId: currentUser.id,
                      title: newItineraryTitle,
                      city: newItineraryCity,
                      date: new Date(newItineraryDate), // Convert string to Date object
                      activities: [],
                      metadata: itineraryMetadata // Store additional fields as metadata
                    }
                  );
                  
                  const data = await response.json();
                  
                  setShowCreateItineraryModal(false);
                  
                  // If we have place details, add the place to the new itinerary
                  if (placeId && placeDetails) {
                    const id = data?.itinerary?.id;
                    
                    if (id && typeof id === 'number') {
                      await addToItinerary(id);
                    } else {
                      console.error("Couldn't determine itinerary ID from response", data);
                      alert("Itinerary created but couldn't add place. Please try adding it manually.");
                    }
                  } else {
                    // Just show success message
                    alert("Itinerary created successfully!");
                  }
                } catch (error) {
                  console.error('Failed to create itinerary:', error);
                  alert("Failed to create itinerary. Please try again.");
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Itinerary Title</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2 text-sm"
                      value={newItineraryTitle}
                      onChange={(e) => setNewItineraryTitle(e.target.value)}
                      placeholder="e.g. Weekend in Kolkata"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2 text-sm"
                      value={newItineraryCity}
                      onChange={(e) => setNewItineraryCity(e.target.value)}
                      placeholder="e.g. Kolkata"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full border rounded-lg p-2 text-sm"
                        value={newItineraryDate}
                        onChange={(e) => setNewItineraryDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        className="w-full border rounded-lg p-2 text-sm"
                        value={newItineraryTime}
                        onChange={(e) => setNewItineraryTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (days)</label>
                      <select
                        className="w-full border rounded-lg p-2 text-sm"
                        value={newItineraryDuration}
                        onChange={(e) => setNewItineraryDuration(e.target.value)}
                        required
                      >
                        <option value="1">1 day</option>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="4">4 days</option>
                        <option value="5">5 days</option>
                        <option value="7">1 week</option>
                        <option value="14">2 weeks</option>
                        <option value="30">1 month</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget (₹)</label>
                      <input
                        type="number"
                        className="w-full border rounded-lg p-2 text-sm"
                        value={newItineraryBudget}
                        onChange={(e) => setNewItineraryBudget(e.target.value)}
                        placeholder="e.g. 25000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Transportation</label>
                      <select
                        className="w-full border rounded-lg p-2 text-sm"
                        value={newItineraryTransport}
                        onChange={(e) => setNewItineraryTransport(e.target.value)}
                      >
                        <option value="flight">Flight</option>
                        <option value="train">Train</option>
                        <option value="bus">Bus</option>
                        <option value="car">Car</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Accommodation</label>
                      <select
                        className="w-full border rounded-lg p-2 text-sm"
                        value={newItineraryAccommodation}
                        onChange={(e) => setNewItineraryAccommodation(e.target.value)}
                      >
                        <option value="hotel">Hotel</option>
                        <option value="hostel">Hostel</option>
                        <option value="resort">Resort</option>
                        <option value="homestay">Homestay</option>
                        <option value="airbnb">Airbnb</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full border rounded-lg p-2 text-sm h-20"
                      value={newItineraryNotes}
                      onChange={(e) => setNewItineraryNotes(e.target.value)}
                      placeholder="Any special requirements or preferences..."
                    ></textarea>
                  </div>
                  
                  {placeId && placeDetails && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MapPin className="text-blue-600 mt-1" size={16} />
                        <div>
                          <p className="text-xs text-blue-600 font-medium">Will add this place:</p>
                          <p className="font-medium text-sm">{placeDetails.name}</p>
                          <p className="text-xs text-gray-500">{placeDetails.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateItineraryModal(false)}
                      className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Create Itinerary
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Main Social Page Component
export default function Social() {
  const [, navigate] = useLocation();
  const { currentUser } = useApp();
  
  // Fetch feed posts for the current user
  const { data: feedData, refetch: refetchFeed } = useQuery({
    queryKey: [`/api/feed/${currentUser?.id}`],
    enabled: !!currentUser?.id
  });
  
  // Type assertion to handle the response format
  const feedData1 = feedData as { posts?: Post[] } | undefined;
  const posts = feedData1?.posts || [];
  
  // Create a new post
  const createPost = async (postData: any) => {
    if (!currentUser) return;
    
    try {
      await apiRequest(
        'POST',
        '/api/posts',
        {
          userId: currentUser.id,
          ...postData
        }
      );
      
      refetchFeed();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  
  // Like a post
  const likePost = async (postId: number) => {
    try {
      await apiRequest('POST', `/api/posts/${postId}/like`);
      
      refetchFeed();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };
  
  // Comment on a post
  const commentOnPost = async (postId: number, content: string) => {
    if (!currentUser) return;
    
    try {
      await apiRequest(
        'POST',
        '/api/comments',
        {
          postId,
          userId: currentUser.id,
          content
        }
      );
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };
  
  return (
    <div className="flex-1 overflow-hidden">
      <header className="bg-card dark:bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="mr-2 text-foreground">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-poppins font-semibold text-foreground text-lg">Travel Social</h1>
              <p className="text-muted-foreground text-sm">Connect with other travelers</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100%-56px)] overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {/* Followers Section */}
          {currentUser?.id && (
            <div className="bg-card dark:bg-card rounded-lg shadow-md mb-4">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-lg">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="font-medium">{currentUser.displayName}</h2>
                    <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                  </div>
                </div>
                
                <FollowersSection userId={currentUser.id} />
              </div>
            </div>
          )}
          
          {/* New Post Form */}
          <NewPostForm onSubmit={createPost} />
          
          {/* Feed */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post: Post) => (
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