// --- existing imports ---
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Brain,
  UserCircle2,
  TrendingUp,
  UserPlus,
  Settings,
  Users2,
  FileText,
  Trash2,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { mockMembers } from "../pages/Members";

// --- types ---
interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

interface Quiz {
  name: string;
  code: string;
  link: string;
  responseLink: string;
  description: string;
  difficulty: string;
}

interface NewsItem {
  title: string;
  link: string;
  date: string;
  image: string;
  description: string;
}
interface SuggestionItem {
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

interface User {
  name: string;
  usn: string;
}

interface MovieSuggestion {
  id: string;
  movie_name: string;
  user_id: string;
  user_name: string;
  user_usn: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// --- component ---
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [announcementInput, setAnnouncementInput] = useState("");

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizInput, setQuizInput] = useState<Quiz>({
    name: "",
    code: "",
    link: "",
    responseLink: "",
    description: "",
    difficulty: "Medium",
  });

  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsInput, setNewsInput] = useState<NewsItem>({
    title: "",
    link: "",
    date: "",
    image: "",
    description: "",
  });

  const [moviesInput, setMoviesInput] = useState<SuggestionItem>({
    title: "",
    link: "",
    image: "",
  });

  const [totalMembers, setTotalMembers] = useState(0);
  const [quizCompletions, setQuizCompletions] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [movies, setMovies] = useState<SuggestionItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [movieSuggestions, setMovieSuggestions] = useState<MovieSuggestion[]>([]);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { data: announcementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (announcementsData) {
        setAnnouncements(announcementsData.map((a: any) => a.message));
      }

      const { data: quizzesData } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });
      if (quizzesData) {
        setQuizzes(quizzesData as Quiz[]);
      }

      const { data: newsData } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      if (newsData) {
        setNews(newsData as NewsItem[]);
      }

      const { data: moviesData } = await supabase
       .from("movies")
       .select("*")
       .order("created_at", { ascending: false });

      if (moviesData) {
        setMovies(moviesData as SuggestionItem[]);
      }

      const { count: memberCount } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true });
      if (typeof memberCount === "number") {
        setTotalMembers(memberCount);
      }

      // fetch from quiz_stats instead of quizzes
      const { data: statsData, error: statsError } = await supabase
        .from("quiz_stats")
        .select("total_quiz_insertions")
        .eq("id", 1)
        .single();
      if (!statsError && statsData) {
        setQuizCompletions(statsData.total_quiz_insertions);
      }

      setAdminCount(mockMembers.length);

      // Fetch blogs with author information
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

      // Fetch movie suggestions with user details
      const { data: suggestionsData, error: suggestionsError } = await supabase
        .from('movie_suggestions_with_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (suggestionsError) {
        console.error('Error fetching suggestions:', suggestionsError);
      } else if (suggestionsData) {
        const formattedSuggestions = suggestionsData.map(suggestion => ({
          id: suggestion.id,
          movie_name: suggestion.movie_name,
          user_id: suggestion.user_id,
          user_name: suggestion.user_name || 'Anonymous',
          user_usn: suggestion.user_usn || 'N/A',
          created_at: suggestion.created_at,
          status: suggestion.status
        }));
        setMovieSuggestions(formattedSuggestions);
      }
    };

    fetchData();
  }, [navigate]);

  // Add useEffect to check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !userData || userData.role !== 'admin') {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdminStatus();
  }, [navigate]);

  const stats: StatCard[] = [
    {
      title: "Users",
      value: totalMembers,
      icon: UserCircle2 ,
      color: "text-google-blue",
    },
    {
      title: "Active Quizzes",
      value: quizzes.length,
      icon: Brain,
      color: "text-google-red",
    },
    {
      title: "Members",
      value: adminCount,
      icon:Users,
      color: "text-google-yellow",
    },
    {
      title: "Quiz Completions",
      value: quizCompletions,
      icon: TrendingUp,
      color: "text-google-green",
    },
  ];

  const handleAnnouncementSubmit = async () => {
    if (announcementInput.trim()) {
      const { error } = await supabase
        .from("announcements")
        .insert([{ message: announcementInput.trim() }]);
      if (!error) {
        setAnnouncements([announcementInput.trim(), ...announcements]);
        setAnnouncementInput("");
      }
    }
  };

  const handleDeleteAnnouncement = async (index: number) => {
    const messageToDelete = announcements[index];
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("message", messageToDelete);
    if (!error) {
      setAnnouncements(announcements.filter((_, i) => i !== index));
    }
  };

  const handleQuizSubmit = async () => {
    const { name, code, link, responseLink, description, difficulty } =
      quizInput;
    if (name && code && link && responseLink && description && difficulty) {
      // 1. Insert the quiz
      const { data: inserted, error: insertError } = await supabase
        .from("quizzes")
        .insert([{ name, code, link, responseLink, description, difficulty }])
        .select();

      if (insertError) {
        console.error("Insert failed:", insertError);
        return;
      }

      setQuizzes([
        { name, code, link, responseLink, description, difficulty },
        ...quizzes,
      ]);
      setQuizInput({
        name: "",
        code: "",
        link: "",
        responseLink: "",
        description: "",
        difficulty: "Medium",
      });

      // 2. Increment quiz_stats count
      const { data: statsData, error: statsError } = await supabase
        .from("quiz_stats")
        .select("total_quiz_insertions")
        .eq("id", 1)
        .single();

      if (statsError || !statsData) {
        console.error("Failed to fetch stats:", statsError);
        return;
      }

      const newCount = statsData.total_quiz_insertions + 1;

      const { error: updateError } = await supabase
        .from("quiz_stats")
        .update({ total_quiz_insertions: newCount })
        .eq("id", 1);

      if (updateError) {
        console.error("Failed to update stats:", updateError);
      } else {
        setQuizCompletions(newCount);
      }
    }
  };

  const handleDeleteQuiz = async (index: number) => {
    const quiz = quizzes[index];
    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("code", quiz.code);
    if (!error) {
      setQuizzes(quizzes.filter((_, i) => i !== index));
      // Do NOT decrement quiz_stats
    }
  };

  const handleMoviesSubmit = async () => {
    const { title, link, image } = moviesInput;
    if (title && link && image) {
      const newMovie = { title, link, image };
      const { error } = await supabase.from("movies").insert([newMovie]);
      if (!error) {
        setMovies([newMovie, ...movies]);
        setMoviesInput({ title: "", link: "", image: "" });
      }
    }
  };

  const handleDeleteMovie = async (index: number) => {
    const { title } = movies[index];
    const { error } = await supabase.from("movies").delete().eq("title", title);
    if (!error) {
      setMovies(movies.filter((_, i) => i !== index));
    }
  };

  const handleNewsSubmit = async () => {
    const { title, link, date, image, description } = newsInput;
    if (title && link && date && image && description) {
      const { error } = await supabase
        .from("news")
        .insert([{ title, link, date, image, description }]);
      if (!error) {
        setNews([{ title, link, date, image, description }, ...news]);
        setNewsInput({
          title: "",
          link: "",
          date: "",
          image: "",
          description: "",
        });
      }
    }
  };

  const handleDeleteNews = async (index: number) => {
    const { title } = news[index];
    const { error } = await supabase.from("news").delete().eq("title", title);
    if (!error) {
      setNews(news.filter((_, i) => i !== index));
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      // Update local state
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleApproveSuggestion = async (suggestion: MovieSuggestion) => {
    if (!isAdmin) {
      alert('Only admins can approve suggestions');
      return;
    }

    try {
      // Only update the status to approved
      const { error: updateError } = await supabase
        .from('movie_suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestion.id);

      if (updateError) throw updateError;

      // Update local state
      setMovieSuggestions(movieSuggestions.map(s =>
        s.id === suggestion.id ? { ...s, status: 'approved' } : s
      ));

      alert('Suggestion marked as approved. Remember to add the movie details later!');
    } catch (error) {
      console.error('Error approving suggestion:', error);
      alert('Failed to approve suggestion. Please try again.');
    }
  };

  const handleRejectSuggestion = async (suggestion: MovieSuggestion) => {
    if (!isAdmin) {
      alert('Only admins can reject suggestions');
      return;
    }

    try {
      const { error } = await supabase
        .from('movie_suggestions')
        .update({ status: 'rejected' })
        .eq('id', suggestion.id);

      if (error) throw error;

      // Update local state
      setMovieSuggestions(movieSuggestions.map(s =>
        s.id === suggestion.id ? { ...s, status: 'rejected' } : s
      ));

      alert('Suggestion rejected');
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
      alert('Failed to reject suggestion. Please try again.');
    }
  };

  const handleDeleteSuggestion = async (suggestion: MovieSuggestion) => {
    if (!isAdmin) {
      alert('Only admins can delete suggestions');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this suggestion?')) {
      return;
    }

    try {
      // Delete directly from movie_suggestions table
      const { error } = await supabase
        .from('movie_suggestions')
        .delete()
        .eq('id', suggestion.id);

      if (error) {
        console.error('Database deletion error:', error);
        throw error;
      }

      // Update the UI
      setMovieSuggestions(prevSuggestions => 
        prevSuggestions.filter(s => s.id !== suggestion.id)
      );

      alert('Suggestion deleted successfully');
    } catch (error) {
      console.error('Error in delete operation:', error);
      alert('Failed to delete suggestion. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button className="btn-primary flex items-center space-x-2" onClick={() => window.open("https://supabase.com/dashboard/projects", "_blank")}>
            <UserPlus className="h-5 w-5" />
            <span>Add Admin</span>
          </button>
          <button className="btn-primary flex items-center space-x-2" onClick={() => window.open("https://github.com/CSE-TechClub/Club", "_blank")}>
            <Settings className="h-5 w-5" />
            <span>GitHub</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Announcements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <textarea
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="Type an announcement..."
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleAnnouncementSubmit} className="btn-primary">
            Submit
          </button>
          <ul className="mt-4">
            {announcements.map((msg, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                {msg}
                <button
                  onClick={() => handleDeleteAnnouncement(i)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quizzes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
          {Object.entries(quizInput).map(([field, val]) =>
            field !== "description" && field !== "difficulty" ? (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={(quizInput as any)[field]}
                onChange={(e) =>
                  setQuizInput({ ...quizInput, [field]: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
            ) : field === "description" ? (
              <textarea
                key={field}
                placeholder="Description"
                value={quizInput.description}
                onChange={(e) =>
                  setQuizInput({ ...quizInput, description: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
            ) : (
              <select
                key={field}
                value={quizInput.difficulty}
                onChange={(e) =>
                  setQuizInput({ ...quizInput, difficulty: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            )
          )}
          <button onClick={handleQuizSubmit} className="btn-primary">
            Submit
          </button>
          <ul className="mt-4">
            {quizzes.map((q, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <div>
                  <span className="font-medium">
                    {q.name} ({q.code})
                  </span>
                  <p className="italic text-sm text-gray-600">
                    Difficulty: {q.difficulty}
                  </p>
                  <p className="text-sm">
                    <a
                      href={q.responseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Responses
                    </a>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQuiz(i)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* News */}
        <div className="bg-white rounded-lg shadow-md p-6 ">
          <h2 className="text-xl font-semibold mb-4">News</h2>
          {Object.entries(newsInput).map(([field, val]) =>
            field !== "description" ? (
              <input
                key={field}
                type={field === "date" ? "date" : "text"}
                placeholder={field}
                value={(newsInput as any)[field]}
                onChange={(e) =>
                  setNewsInput({ ...newsInput, [field]: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
            ) : (
              <textarea
                key={field}
                placeholder="Description"
                value={newsInput.description}
                onChange={(e) =>
                  setNewsInput({ ...newsInput, description: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              />
            )
          )}
          <button onClick={handleNewsSubmit} className="btn-primary">
            Submit
          </button>
          <ul className="mt-4">
            {news.map((n, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <div>
                  <span className="font-medium">{n.title}</span>
                  <p className="text-gray-600 text-sm">Date: {n.date}</p>
                </div>
                <button
                  onClick={() => handleDeleteNews(i)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Movies */}
        <div className="bg-white rounded-lg shadow-md p-6 ">
          <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
          {Object.entries(moviesInput).map(([field, val]) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={val}
              onChange={(e) =>
                setMoviesInput({ ...moviesInput, [field]: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <button onClick={handleMoviesSubmit} className="btn-primary">
            Submit
          </button>

          <ul className="mt-4">
            {movies.map((m, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <div>
                  <span className="font-medium">{m.title}</span>
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-16 h-16 object-cover mt-2"
                  />
                </div>
                <button
                  onClick={() => handleDeleteMovie(i)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Blogs Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Blogs Management</h2>
            <FileText className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            {blogs.map((blog) => (
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
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <p className="text-gray-500 text-center py-4">No blogs found</p>
            )}
          </div>
        </div>

        {/* Movie Suggestions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Movie Suggestions</h2>
            <FileText className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            {movieSuggestions && movieSuggestions.length > 0 ? (
              movieSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {suggestion.movie_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>Suggested by: {suggestion.user_name}</span>
                        <span>USN: {suggestion.user_usn}</span>
                        <span>Date: {new Date(suggestion.created_at).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {suggestion.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveSuggestion(suggestion)}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                            title="Approve suggestion"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRejectSuggestion(suggestion)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Reject suggestion"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDeleteSuggestion(suggestion)}
                          className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete suggestion"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No movie suggestions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
