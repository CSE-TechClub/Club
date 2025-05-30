import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Star, UserCircle2, Megaphone, Brain, Newspaper, Film, FileText } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  usn: string;
  role: string;
  reputation?: number;
  created_at?: string;
}

interface Announcement {
  id: string;
  message: string;
  created_at: string;
}

interface Quiz {
  id: string;
  name: string;
  code: string;
  link: string;
  responseLink: string;
  description: string;
  difficulty: string;
  created_at: string;
}

interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  image: string;
  description: string;
}

interface MovieItem {
  title: string;
  link: string;
  image: string;
}

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

interface BlogWithUser extends Omit<Blog, 'author'> {
  users: {
    name: string;
    usn: string;
  } | null;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementInput, setAnnouncementInput] = useState("");
  const [announcementError, setAnnouncementError] = useState<string | null>(null);
  
  // Quiz states
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizInput, setQuizInput] = useState<Quiz>({
    id: "",
    name: "",
    code: "",
    link: "",
    responseLink: "",
    description: "",
    difficulty: "Medium",
    created_at: new Date().toISOString()
  });
  const [quizError, setQuizError] = useState<string | null>(null);

  // News states
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsInput, setNewsInput] = useState<NewsItem>({
    id: "",
    title: "",
    link: "",
    date: "",
    image: "",
    description: ""
  });
  const [newsError, setNewsError] = useState<string | null>(null);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  // Suggestion states
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [movieInput, setMovieInput] = useState<MovieItem>({
    title: "",
    link: "",
    image: ""
  });
  const [movieError, setMovieError] = useState<string | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  // Blog states
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!user || authError) {
          setError("Please login to view your profile");
          return;
        }

        // First try to get all fields
        const { data, error } = await supabase
          .from("users")
          .select("name, email, usn, role, reputation, created_at")
          .eq("id", user.id)
          .single();

        if (error) {
          // If error, try without the new columns
          const { data: basicData, error: basicError } = await supabase
            .from("users")
            .select("name, email, usn, role")
            .eq("id", user.id)
            .single();

          if (basicError) {
            throw basicError;
          }

          // Set profile with default values for new columns
          setUserProfile({
            ...basicData,
            reputation: 0,
            created_at: new Date().toISOString()
          });
        } else {
          setUserProfile(data);
        }

        // Fetch announcements only for Lead users
        if (data?.role === 'Lead') {
          const { data: announcementsData, error: announcementsError } = await supabase
            .from("announcements")
            .select("id, message, created_at")
            .order("created_at", { ascending: false });

          if (announcementsError) {
            console.error("Error fetching announcements:", announcementsError);
            setAnnouncementError("Failed to load announcements");
          } else if (announcementsData) {
            setAnnouncements(announcementsData);
          }
        }

        // Fetch quizzes for Quizmaster
        if (data?.role === 'Quizmaster') {
          const { data: quizzesData, error: quizzesError } = await supabase
            .from("quizzes")
            .select("*")
            .order("created_at", { ascending: false });

          if (quizzesError) {
            console.error("Error fetching quizzes:", quizzesError);
            setQuizError("Failed to load quizzes");
          } else if (quizzesData) {
            setQuizzes(quizzesData);
          }
        }

        // Fetch news for News-Master
        if (data?.role === 'News-Master') {
          setIsNewsLoading(true);
          const { data: newsData, error: newsError } = await supabase
            .from("news")
            .select("id, title, link, date, image, description")
            .order("date", { ascending: false });

          if (newsError) {
            console.error("Error fetching news:", newsError);
            setNewsError("Failed to load news");
          } else if (newsData) {
            setNews(newsData);
          }
          setIsNewsLoading(false);
        }

        // Fetch movies for Suggestion Manager
        if (data?.role === 'Suggestion Manager') {
          setIsMovieLoading(true);
          const { data: moviesData, error: moviesError } = await supabase
            .from("movies")
            .select("*")
            .order("created_at", { ascending: false });

          if (moviesError) {
            console.error("Error fetching movies:", moviesError);
            setMovieError("Failed to load movies");
          } else if (moviesData) {
            setMovies(moviesData);
          }
          setIsMovieLoading(false);
        }

        // Fetch blogs for Blog Manager
        if (data?.role === 'Blog Manager') {
          setIsBlogLoading(true);
          const { data: blogsData, error: blogsError } = await supabase
            .from('blogs')
            .select(`
              id,
              title,
              content,
              description,
              banner_url,
              category,
              author_id,
              likes,
              created_at,
              users!author_id (
                name,
                usn
              )
            `)
            .order('created_at', { ascending: false });

          if (blogsError) {
            console.error('Error fetching blogs:', blogsError);
            setBlogError("Failed to load blogs");
          } else if (blogsData) {
            // Transform the data to match our Blog interface
            const transformedBlogs: Blog[] = (blogsData as unknown as BlogWithUser[]).map(blog => ({
              id: blog.id,
              title: blog.title,
              content: blog.content,
              description: blog.description,
              banner_url: blog.banner_url,
              category: blog.category,
              author_id: blog.author_id,
              likes: blog.likes,
              created_at: blog.created_at,
              author: {
                name: blog.users?.name || 'Anonymous',
                usn: blog.users?.usn || 'N/A'
              }
            }));
            setBlogs(transformedBlogs);
          }
          setIsBlogLoading(false);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAnnouncementSubmit = async () => {
    try {
      setAnnouncementError(null);
      
      if (!announcementInput.trim()) {
        setAnnouncementError("Announcement cannot be empty");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAnnouncementError("You must be logged in to post announcements");
        return;
      }

      // Verify user is a Lead
      if (userProfile?.role !== 'Lead') {
        setAnnouncementError("Only Leads can post announcements");
        return;
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert([
          { 
            message: announcementInput.trim()
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '42501') {
          setAnnouncementError("You don't have permission to post announcements");
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        setAnnouncements([data, ...announcements]);
        setAnnouncementInput("");
      }
    } catch (err) {
      console.error("Error posting announcement:", err);
      setAnnouncementError("Failed to post announcement. Please try again.");
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      setAnnouncementError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAnnouncementError("You must be logged in to delete announcements");
        return;
      }

      // Verify user is a Lead
      if (userProfile?.role !== 'Lead') {
        setAnnouncementError("Only Leads can delete announcements");
        return;
      }

      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcementId);

      if (error) {
        if (error.code === '42501') {
          setAnnouncementError("You don't have permission to delete announcements");
        } else {
          throw error;
        }
        return;
      }

      setAnnouncements(announcements.filter(a => a.id !== announcementId));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setAnnouncementError("Failed to delete announcement. Please try again.");
    }
  };

  const handleQuizSubmit = async () => {
    try {
      setQuizError(null);
      
      const { name, code, link, responseLink, description, difficulty } = quizInput;
      
      // Enhanced validation
      if (!name.trim()) {
        setQuizError("Quiz name is required");
        return;
      }
      if (!code.trim()) {
        setQuizError("Quiz code is required");
        return;
      }
      if (!link.trim() || !link.startsWith('http')) {
        setQuizError("Valid quiz link is required");
        return;
      }
      if (!responseLink.trim() || !responseLink.startsWith('http')) {
        setQuizError("Valid response link is required");
        return;
      }
      if (!description.trim()) {
        setQuizError("Description is required");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setQuizError("You must be logged in to post quizzes");
        return;
      }

      // Verify user is a Quizmaster
      if (userProfile?.role !== 'Quizmaster') {
        setQuizError("Only Quizmasters can post quizzes");
        return;
      }

      // Check if quiz code already exists
      const { data: existingQuiz } = await supabase
        .from("quizzes")
        .select("code")
        .eq("code", code.trim())
        .single();

      if (existingQuiz) {
        setQuizError("A quiz with this code already exists");
        return;
      }

      const { data, error } = await supabase
        .from("quizzes")
        .insert([{ 
          name: name.trim(),
          code: code.trim(),
          link: link.trim(),
          responseLink: responseLink.trim(),
          description: description.trim(),
          difficulty
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '42501') {
          setQuizError("You don't have permission to post quizzes");
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        setQuizzes([data, ...quizzes]);
        // Reset form
        setQuizInput({
          id: "",
          name: "",
          code: "",
          link: "",
          responseLink: "",
          description: "",
          difficulty: "Medium",
          created_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error posting quiz:", err);
      setQuizError("Failed to post quiz. Please try again.");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      setQuizError(null);

      if (!window.confirm('Are you sure you want to delete this quiz?')) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setQuizError("You must be logged in to delete quizzes");
        return;
      }

      // Verify user is a Quizmaster
      if (userProfile?.role !== 'Quizmaster') {
        setQuizError("Only Quizmasters can delete quizzes");
        return;
      }

      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", quizId);

      if (error) {
        if (error.code === '42501') {
          setQuizError("You don't have permission to delete quizzes");
        } else {
          throw error;
        }
        return;
      }

      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setQuizError("Failed to delete quiz. Please try again.");
    }
  };

  const handleNewsSubmit = async () => {
    try {
      setNewsError(null);
      setIsNewsLoading(true);
      
      const { title, link, date, image, description } = newsInput;
      
      // Enhanced validation
      if (!title.trim()) {
        setNewsError("Title is required");
        return;
      }
      if (!link.trim() || !link.startsWith('http')) {
        setNewsError("Valid news link is required");
        return;
      }
      if (!date) {
        setNewsError("Date is required");
        return;
      }
      if (!image.trim() || !image.startsWith('http')) {
        setNewsError("Valid image URL is required");
        return;
      }
      if (!description.trim()) {
        setNewsError("Description is required");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNewsError("You must be logged in to post news");
        return;
      }

      // Verify user is a News-Master
      if (userProfile?.role !== 'News-Master') {
        setNewsError("Only News-Masters can post news");
        return;
      }

      const { data, error } = await supabase
        .from("news")
        .insert([{ 
          title: title.trim(),
          link: link.trim(),
          date,
          image: image.trim(),
          description: description.trim()
        }])
        .select("id, title, link, date, image, description")
        .single();

      if (error) {
        if (error.code === '42501') {
          setNewsError("You don't have permission to post news");
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        setNews([data, ...news]);
        // Reset form
        setNewsInput({
          id: "",
          title: "",
          link: "",
          date: "",
          image: "",
          description: ""
        });
      }
    } catch (err) {
      console.error("Error posting news:", err);
      setNewsError("Failed to post news. Please try again.");
    } finally {
      setIsNewsLoading(false);
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    try {
      setNewsError(null);

      if (!window.confirm('Are you sure you want to delete this news item?')) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNewsError("You must be logged in to delete news");
        return;
      }

      // Verify user is a News-Master
      if (userProfile?.role !== 'News-Master') {
        setNewsError("Only News-Masters can delete news");
        return;
      }

      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", newsId);

      if (error) {
        if (error.code === '42501') {
          setNewsError("You don't have permission to delete news");
        } else {
          throw error;
        }
        return;
      }

      setNews(news.filter(n => n.id !== newsId));
    } catch (err) {
      console.error("Error deleting news:", err);
      setNewsError("Failed to delete news. Please try again.");
    }
  };

  const handleMoviesSubmit = async () => {
    try {
      setMovieError(null);
      setIsMovieLoading(true);
      
      const { title, link, image } = movieInput;
      
      // Enhanced validation
      if (!title.trim()) {
        setMovieError("Title is required");
        return;
      }
      if (!link.trim() || !link.startsWith('http')) {
        setMovieError("Valid movie link is required");
        return;
      }
      if (!image.trim() || !image.startsWith('http')) {
        setMovieError("Valid image URL is required");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMovieError("You must be logged in to add movies");
        return;
      }

      // Verify user is a Suggestion Manager
      if (userProfile?.role !== 'Suggestion Manager') {
        setMovieError("Only Suggestion Managers can add movies");
        return;
      }

      const { data, error } = await supabase
        .from("movies")
        .insert([{ 
          title: title.trim(),
          link: link.trim(),
          image: image.trim()
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '42501') {
          setMovieError("You don't have permission to add movies");
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        setMovies([data, ...movies]);
        // Reset form
        setMovieInput({
          title: "",
          link: "",
          image: ""
        });
      }
    } catch (err) {
      console.error("Error adding movie:", err);
      setMovieError("Failed to add movie. Please try again.");
    } finally {
      setIsMovieLoading(false);
    }
  };

  const handleDeleteMovie = async (title: string) => {
    try {
      setMovieError(null);
      setIsMovieLoading(true);

      if (!window.confirm('Are you sure you want to delete this movie?')) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMovieError("You must be logged in to delete movies");
        return;
      }

      // Verify user is a Suggestion Manager
      if (userProfile?.role !== 'Suggestion Manager') {
        setMovieError("Only Suggestion Managers can delete movies");
        return;
      }

      const { error } = await supabase
        .from("movies")
        .delete()
        .eq("title", title);

      if (error) {
        if (error.code === '42501') {
          setMovieError("You don't have permission to delete movies");
        } else {
          throw error;
        }
        return;
      }

      setMovies(movies.filter(m => m.title !== title));
    } catch (err) {
      console.error("Error deleting movie:", err);
      setMovieError("Failed to delete movie. Please try again.");
    } finally {
      setIsMovieLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setBlogError(null);
      setIsBlogLoading(true);

      if (!window.confirm('Are you sure you want to delete this blog?')) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBlogError("You must be logged in to delete blogs");
        return;
      }

      // Verify user is a Blog Manager
      if (userProfile?.role !== 'Blog Manager') {
        setBlogError("Only Blog Managers can delete blogs");
        return;
      }

      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) {
        if (error.code === '42501') {
          setBlogError("You don't have permission to delete blogs");
        } else {
          throw error;
        }
        return;
      }

      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      setBlogError("Failed to delete blog. Please try again.");
    } finally {
      setIsBlogLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
        <div className="text-center text-gray-500">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <UserCircle2 className="h-16 w-16 text-gray-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.usn}</p>
          <p className="text-sm text-gray-500 capitalize">{userProfile.role}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-semibold text-gray-900">
            Reputation: {userProfile.reputation || 0}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Member since {new Date(userProfile.created_at || new Date()).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-4 text-gray-700 text-lg mb-6">
        <div><strong>Email:</strong> {userProfile.email}</div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Likes Received</span>
            <span className="font-medium text-gray-900">{userProfile.reputation || 0}</span>
          </div>
        </div>
      </div>

      {/* Announcement Section only for Lead users */}
      {userProfile.role === 'Lead' && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Megaphone className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
          </div>
          <div className="space-y-4">
            <textarea
              value={announcementInput}
              onChange={(e) => setAnnouncementInput(e.target.value)}
              placeholder="Type an announcement..."
              className="w-full p-2 border rounded mb-2 min-h-[100px] resize-y"
            />
            {announcementError && (
              <p className="text-red-500 text-sm">{announcementError}</p>
            )}
            <button
              onClick={handleAnnouncementSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Post Announcement
            </button>
            <div className="space-y-2 mt-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-gray-700">{announcement.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Posted on {new Date(announcement.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Section for Quizmaster users */}
      {userProfile.role === 'Quizmaster' && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quiz Management</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Quiz Name"
                  value={quizInput.name}
                  onChange={(e) => setQuizInput({ ...quizInput, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Quiz Code"
                  value={quizInput.code}
                  onChange={(e) => setQuizInput({ ...quizInput, code: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Quiz Link"
                  value={quizInput.link}
                  onChange={(e) => setQuizInput({ ...quizInput, link: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Response Link"
                  value={quizInput.responseLink}
                  onChange={(e) => setQuizInput({ ...quizInput, responseLink: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <textarea
              placeholder="Description"
              value={quizInput.description}
              onChange={(e) => setQuizInput({ ...quizInput, description: e.target.value })}
              className="w-full p-2 border rounded min-h-[100px] resize-y"
            />
            <select
              value={quizInput.difficulty}
              onChange={(e) => setQuizInput({ ...quizInput, difficulty: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {quizError && (
              <p className="text-red-500 text-sm">{quizError}</p>
            )}
            <button
              onClick={handleQuizSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add Quiz
            </button>
            <div className="space-y-2 mt-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{quiz.name}</h4>
                    <p className="text-sm text-gray-600">Code: {quiz.code}</p>
                    <p className="text-sm text-gray-600">Difficulty: {quiz.difficulty}</p>
                    <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                    <div className="mt-2 space-x-2">
                      <a
                        href={quiz.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Quiz Link
                      </a>
                      <a
                        href={quiz.responseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View Responses
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {quizzes.length === 0 && (
                <p className="text-gray-500 text-center py-4">No quizzes added yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* News Section for News-Master users */}
      {userProfile.role === 'News-Master' && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">News Management</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="News Title"
                value={newsInput.title}
                onChange={(e) => setNewsInput({ ...newsInput, title: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
              <input
                type="url"
                placeholder="News Link"
                value={newsInput.link}
                onChange={(e) => setNewsInput({ ...newsInput, link: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
              <input
                type="date"
                value={newsInput.date}
                onChange={(e) => setNewsInput({ ...newsInput, date: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newsInput.image}
                onChange={(e) => setNewsInput({ ...newsInput, image: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newsInput.description}
              onChange={(e) => setNewsInput({ ...newsInput, description: e.target.value })}
              className="w-full p-2 border rounded min-h-[100px] resize-y"
              disabled={isNewsLoading}
            />
            {newsError && (
              <p className="text-red-500 text-sm">{newsError}</p>
            )}
            <button
              onClick={handleNewsSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isNewsLoading}
            >
              {isNewsLoading ? 'Adding News...' : 'Add News'}
            </button>
            <div className="space-y-2 mt-4">
              {isNewsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : news.length > 0 ? (
                news.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">Date: {new Date(item.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="mt-2 space-x-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Read More
                        </a>
                        {item.image && (
                          <a
                            href={item.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                          >
                            View Image
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={isNewsLoading}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No news items added yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movie Management Section for Suggestion Manager users */}
      {userProfile.role === 'Suggestion Manager' && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Film className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Content Management</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title (Movie/Documentary)"
                value={movieInput.title}
                onChange={(e) => setMovieInput({ ...movieInput, title: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isMovieLoading}
              />
              <input
                type="url"
                placeholder="Content Link"
                value={movieInput.link}
                onChange={(e) => setMovieInput({ ...movieInput, link: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isMovieLoading}
              />
              <input
                type="url"
                placeholder="Thumbnail URL"
                value={movieInput.image}
                onChange={(e) => setMovieInput({ ...movieInput, image: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={isMovieLoading}
              />
            </div>
            {movieError && (
              <p className="text-red-500 text-sm">{movieError}</p>
            )}
            <button
              onClick={handleMoviesSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isMovieLoading}
            >
              {isMovieLoading ? 'Adding Content...' : 'Add Content'}
            </button>
            <div className="space-y-2 mt-4">
              {isMovieLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : movies.length > 0 ? (
                movies.map((movie, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{movie.title}</h4>
                        <a
                          href={movie.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Watch Content
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMovie(movie.title)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={isMovieLoading}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No content added yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Blog Management Section for Blog Manager users */}
      {userProfile.role === 'Blog Manager' && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Blog Management</h3>
            </div>
            <span className="text-sm text-gray-500">Total Blogs: {blogs.length}</span>
          </div>
          <div className="space-y-4">
            {blogError && (
              <p className="text-red-500 text-sm">{blogError}</p>
            )}
            <div className="space-y-4">
              {isBlogLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{blog.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>By: {blog.author?.name || 'Anonymous'}</span>
                          <span>Category: {blog.category}</span>
                          <span>Likes: {blog.likes || 0}</span>
                          <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete blog"
                        disabled={isBlogLoading}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No blogs found</p>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
