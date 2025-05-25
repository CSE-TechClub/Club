import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Flag, PenSquare, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../styles/editor.css';
import '../styles/blog.css';

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
  author: {
    name: string;
    usn: string;
  };
}

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReported, setIsReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBlog();
    checkIfLiked();
    checkIfReported();
  }, [id]);

  useEffect(() => {
    if (blog) {
      checkIfAuthor();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (blogError) throw blogError;

      if (blogData) {
        const { data: authorData, error: authorError } = await supabase
          .from('users')
          .select('name, usn')
          .eq('id', blogData.author_id)
          .single();

        if (authorError) throw authorError;

        setBlog({
          ...blogData,
          author: authorData || { name: 'Anonymous', usn: 'N/A' }
        });
        setLikeCount(blogData.likes || 0);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', id)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const checkIfReported = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('blog_reports')
        .select('id')
        .eq('blog_id', id)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsReported(true);
      }
    } catch (error) {
      console.error('Error checking report status:', error);
    }
  };

  const checkIfAuthor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !blog) return;

      setIsAuthor(user.id === blog.author_id);
    } catch (error) {
      console.error('Error checking author status:', error);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      if (isLiked) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blog.id)
          .eq('user_id', user.id);

        if (unlikeError) {
          console.error('Error unliking blog:', unlikeError);
          return;
        }

        // Update blog likes count
        const { error: blogError } = await supabase
          .from('blogs')
          .update({ likes: likeCount - 1 })
          .eq('id', blog.id);

        if (blogError) {
          console.error('Error updating blog likes:', blogError);
          return;
        }

        // Update author's reputation
        const { data: reputationData, error: userError } = await supabase
          .rpc('decrement_reputation', { user_id: blog.author_id });

        if (userError) {
          console.error('Error updating reputation:', userError);
          return;
        }

        console.log('Reputation updated:', reputationData);

        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        // Like
        const { error: likeError } = await supabase
          .from('blog_likes')
          .insert({ blog_id: blog.id, user_id: user.id });

        if (likeError) {
          console.error('Error liking blog:', likeError);
          return;
        }

        // Update blog likes count
        const { error: blogError } = await supabase
          .from('blogs')
          .update({ likes: likeCount + 1 })
          .eq('id', blog.id);

        if (blogError) {
          console.error('Error updating blog likes:', blogError);
          return;
        }

        // Update author's reputation
        const { data: reputationData, error: userError } = await supabase
          .rpc('increment_reputation', { user_id: blog.author_id });

        if (userError) {
          console.error('Error updating reputation:', userError);
          return;
        }

        console.log('Reputation updated:', reputationData);

        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReport = async () => {
    if (!blog) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      if (isReported) {
        // Remove report
        const { error: removeError } = await supabase
          .from('blog_reports')
          .delete()
          .eq('blog_id', blog.id)
          .eq('user_id', user.id);

        if (removeError) {
          console.error('Error removing report:', removeError);
          return;
        }

        setIsReported(false);
      } else {
        // Show report modal
        setShowReportModal(true);
      }
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  const submitReport = async () => {
    if (!blog || !reportReason.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has already reported this blog
      const { data: existingReport } = await supabase
        .from('blog_reports')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('user_id', user.id)
        .single();

      if (existingReport) {
        console.error('User has already reported this blog');
        return;
      }

      const { error: reportError } = await supabase
        .from('blog_reports')
        .insert({
          blog_id: blog.id,
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
        .eq('blog_id', blog.id);

      if (reportCount && reportCount.length >= 5) {
        // Blog will be automatically deleted by the trigger
        navigate('/blogs');
        return;
      }

      setIsReported(true);
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    try {
      setIsDeleting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== blog.author_id) {
        alert('You are not authorized to delete this blog');
        return;
      }

      // Delete the blog
      const { error: deleteError } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blog.id);

      if (deleteError) throw deleteError;

      // Navigate back to blogs page after successful deletion
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/blogs')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Blogs
      </button>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <img
            src={blog.banner_url}
            alt={blog.title}
            className="w-full h-full object-contain sm:object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {blog.category}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {blog.author.name}
                </p>
                <p className="text-gray-600">{blog.author.usn}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {isAuthor && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(`/edit-blog/${blog.id}`)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <PenSquare className="h-5 w-5" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    isLiked ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
                  }`}
                >
                  <Star className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likeCount}</span>
                </button>
                <button
                  onClick={handleReport}
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    isReported ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Flag className={`h-5 w-5 ${isReported ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 text-lg">{blog.description}</p>
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Blog</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
  );
};

export default BlogDetails; 