import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, PenSquare, Flag } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { playLikeSound, playUnlikeSound } from '../utils/sound';

interface Blog {
  id: string;
  title: string;
  content: string;
  description: string;
  banner_url: string;
  category: string;
  author_id: string;
  likes: number;
  created_at: string;
  is_featured: boolean;
  author: {
    name: string;
    usn: string;
  };
  is_liked?: boolean;
  is_reported?: boolean;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch blogs with author information
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select(`
          *,
          author:users(name, usn)
        `)
        .order('created_at', { ascending: false });

      if (blogsError) throw blogsError;

      if (user) {
        // If user is logged in, fetch their likes and reports
        const [likesData, reportsData] = await Promise.all([
          supabase
            .from('blog_likes')
            .select('blog_id')
            .eq('user_id', user.id),
          supabase
            .from('blog_reports')
            .select('blog_id')
            .eq('user_id', user.id)
        ]);

        // Add is_liked and is_reported flags to blogs
        const blogsWithFlags = blogsData.map(blog => ({
          ...blog,
          is_liked: likesData.data?.some(like => like.blog_id === blog.id) || false,
          is_reported: reportsData.data?.some(report => report.blog_id === blog.id) || false
        }));

        setBlogs(blogsWithFlags);
      } else {
        setBlogs(blogsData);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, blogId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please login to like blogs');
        return;
      }

      const blog = blogs.find(b => b.id === blogId);
      if (!blog) return;

      if (blog.is_liked) {
        // Play unlike sound
        playUnlikeSound();
        
        // Unlike
        const { error: unlikeError } = await supabase
          .from('blog_likes')
          .delete()
          .match({ blog_id: blogId, user_id: user.id });

        if (unlikeError) throw unlikeError;

        // Update blog likes count
        const { error: updateError } = await supabase
          .from('blogs')
          .update({ likes: blog.likes - 1 })
          .eq('id', blogId);

        if (updateError) throw updateError;

        // Update author's reputation
        const { error: reputationError } = await supabase
          .rpc('decrement_reputation', { user_id: blog.author_id });

        if (reputationError) {
          console.error('Error updating reputation:', reputationError);
        }

        // Update local state
        setBlogs(blogs.map(b => 
          b.id === blogId 
            ? { ...b, likes: b.likes - 1, is_liked: false }
            : b
        ));
      } else {
        // Play like sound
        playLikeSound();
        
        // Like
        const { error: likeError } = await supabase
          .from('blog_likes')
          .insert([{ blog_id: blogId, user_id: user.id }]);

        if (likeError) throw likeError;

        // Update blog likes count
        const { error: updateError } = await supabase
          .from('blogs')
          .update({ likes: blog.likes + 1 })
          .eq('id', blogId);

        if (updateError) throw updateError;

        // Update author's reputation
        const { error: reputationError } = await supabase
          .rpc('increment_reputation', { user_id: blog.author_id });

        if (reputationError) {
          console.error('Error updating reputation:', reputationError);
        }

        // Update local state
        setBlogs(blogs.map(b => 
          b.id === blogId 
            ? { ...b, likes: b.likes + 1, is_liked: true }
            : b
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleReport = async (e: React.MouseEvent, blogId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please login to report blogs');
        return;
      }

      const blog = blogs.find(b => b.id === blogId);
      if (!blog) return;

      if (blog.is_reported) {
        // Remove report
        const { error: removeError } = await supabase
          .from('blog_reports')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', user.id);

        if (removeError) {
          console.error('Error removing report:', removeError);
          return;
        }

        // Update local state
        setBlogs(blogs.map(b => 
          b.id === blogId 
            ? { ...b, is_reported: false }
            : b
        ));
      } else {
        // Show report modal
        setSelectedBlogId(blogId);
        setShowReportModal(true);
      }
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  const submitReport = async () => {
    if (!selectedBlogId || !reportReason.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has already reported this blog
      const { data: existingReport } = await supabase
        .from('blog_reports')
        .select('id')
        .eq('blog_id', selectedBlogId)
        .eq('user_id', user.id)
        .single();

      if (existingReport) {
        console.error('User has already reported this blog');
        return;
      }

      const { error: reportError } = await supabase
        .from('blog_reports')
        .insert({
          blog_id: selectedBlogId,
          user_id: user.id,
          reason: reportReason.trim()
        });

      if (reportError) {
        console.error('Error submitting report:', reportError);
        return;
      }

      // Check if blog should be deleted (5+ reports)
      const { data: reportCount } = await supabase
        .from('blog_reports')
        .select('id', { count: 'exact' })
        .eq('blog_id', selectedBlogId);

      if (reportCount && reportCount.length >= 5) {
        // Blog will be automatically deleted by the trigger
        // Remove the blog from the local state
        setBlogs(blogs.filter(b => b.id !== selectedBlogId));
        setShowReportModal(false);
        setReportReason('');
        setSelectedBlogId(null);
        return;
      }

      // Update local state
      setBlogs(blogs.map(b => 
        b.id === selectedBlogId 
          ? { ...b, is_reported: true }
          : b
      ));

      setShowReportModal(false);
      setReportReason('');
      setSelectedBlogId(null);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blogs</h1>
          <p className="text-lg text-gray-600">Discover insights, tutorials, and stories from community</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              to={`/blog/${blog.id}`}
              className={`block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                blog.is_featured ? 'ring-4 ring-yellow-400 relative animate-shine' : ''
              }`}
            >
              {blog.is_featured && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-100/30 to-transparent animate-shimmer pointer-events-none" />
              )}
              <div className="relative h-48">
                <img 
                  src={blog.banner_url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                  {blog.is_featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium shadow-md animate-pulse">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{blog.author?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{blog.author?.usn || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={(e) => handleLike(e, blog.id)}
                    >
                      <Star 
                        className={`h-5 w-5 ${
                          blog.is_liked 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      />
                      <span className="text-sm text-gray-600">{blog.likes || 0}</span>
                    </div>
                    <div 
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={(e) => handleReport(e, blog.id)}
                    >
                      <Flag 
                        className={`h-5 w-5 ${
                          blog.is_reported 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Floating Action Button */}
        <Link
          to="/create-blog"
          className="fixed bottom-10 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PenSquare className="h-5 w-5" />
        </Link>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Report Blog</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please provide a reason for reporting this blog..."
                className="w-full h-32 p-2 border rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setSelectedBlogId(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add these styles at the end of the file, before the export
const styles = `
@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shine {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.1) 25%,
    rgba(255, 215, 0, 0.2) 50%,
    rgba(255, 215, 0, 0.1) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shine 3s infinite linear;
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Blogs; 