import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Star,
  Megaphone,
  Brain,
  Newspaper,
  Film,
  FileText,
} from "lucide-react";
import { uploadToCloudinary } from "../utils/cloudinary";
import { FaGithub, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

interface UserProfile {
  name: string;
  email: string;
  usn: string;
  role: string;
  reputation?: number;
  created_at?: string;
  profile_photo?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  portfolio?: string;
  leetcode?: string;
  resume_pdf?: string;
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
  is_featured: boolean;
  author: {
    name: string;
    usn: string;
  };
}

interface BlogWithUser extends Omit<Blog, "author"> {
  users: {
    name: string;
    usn: string;
  } | null;
}

interface MovieSuggestion {
  id: string;
  movie_name: string;
  user_id: string;
  user_name: string;
  user_usn: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_role: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  is_deleted: boolean;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementInput, setAnnouncementInput] = useState("");
  const [announcementError, setAnnouncementError] = useState<string | null>(
    null
  );

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
    created_at: new Date().toISOString(),
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
    description: "",
  });
  const [newsError, setNewsError] = useState<string | null>(null);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  // Suggestion states
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [movieInput, setMovieInput] = useState<MovieItem>({
    title: "",
    link: "",
    image: "",
  });
  const [movieError, setMovieError] = useState<string | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  // Blog states
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  // Movie suggestions state
  const [movieSuggestions, setMovieSuggestions] = useState<MovieSuggestion[]>(
    []
  );

  // Message states
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({
    recipient_role: "",
    content: "",
  });
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    profile_photo: userProfile?.profile_photo || "",
    github: userProfile?.github || "",
    linkedin: userProfile?.linkedin || "",
    instagram: userProfile?.instagram || "",
    twitter: userProfile?.twitter || "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioLinks, setPortfolioLinks] = useState({
    portfolio: userProfile?.portfolio || "",
    leetcode: userProfile?.leetcode || "",
    resume_pdf: userProfile?.resume_pdf || "",
  });
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Starting profile fetch..."); // Debug log
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!user || authError) {
          console.log("No user found or auth error:", authError); // Debug log
          setError("Please login to view your profile");
          return;
        }

        console.log("User authenticated:", user.id); // Debug log

        // First try to get all fields
        const { data, error } = await supabase
          .from("users")
          .select(
            "name, email, usn, role, reputation, created_at, profile_photo, github, linkedin, instagram, twitter, portfolio, leetcode, resume_pdf"
          )
          .eq("id", user.id)
          .single();

        if (error) {
          console.log("Error fetching full profile:", error); // Debug log
          // If error, try without the new columns
          const { data: basicData, error: basicError } = await supabase
            .from("users")
            .select("name, email, usn, role")
            .eq("id", user.id)
            .single();

          if (basicError) {
            console.log("Error fetching basic profile:", basicError); // Debug log
            throw basicError;
          }

          console.log("Basic profile fetched:", basicData); // Debug log
          // Set profile with default values for new columns
          setUserProfile({
            ...basicData,
            reputation: 0,
            created_at: new Date().toISOString(),
            profile_photo: "",
            github: "",
            linkedin: "",
            instagram: "",
            twitter: "",
            portfolio: "",
            leetcode: "",
            resume_pdf: "",
          });
          setPortfolioLinks({ portfolio: "", leetcode: "", resume_pdf: "" });
        } else {
          console.log("Full profile fetched:", data); // Debug log
          setUserProfile(data);
          setPortfolioLinks({
            portfolio: data.portfolio || "",
            leetcode: data.leetcode || "",
            resume_pdf: data.resume_pdf || "",
          });
        }

        // Fetch announcements only for Lead users
        if (data?.role === "Lead") {
          const { data: announcementsData, error: announcementsError } =
            await supabase
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
        if (data?.role === "Quizmaster") {
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
        if (data?.role === "News-Master") {
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
        if (data?.role === "Suggestion Manager") {
          setIsMovieLoading(true);

          // Fetch movie suggestions with user details
          const { data: suggestionsData, error: suggestionsError } =
            await supabase
              .from("movie_suggestions_with_users")
              .select("*")
              .order("created_at", { ascending: false });

          if (suggestionsError) {
            console.error("Error fetching suggestions:", suggestionsError);
          } else if (suggestionsData) {
            const formattedSuggestions = suggestionsData.map((suggestion) => ({
              id: suggestion.id,
              movie_name: suggestion.movie_name,
              user_id: suggestion.user_id,
              user_name: suggestion.user_name || "Anonymous",
              user_usn: suggestion.user_usn || "N/A",
              created_at: suggestion.created_at,
              status: suggestion.status,
            }));
            setMovieSuggestions(formattedSuggestions);
          }

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
        if (data?.role === "Blog Manager") {
          setIsBlogLoading(true);
          const { data: blogsData, error: blogsError } = await supabase
            .from("blogs")
            .select(
              `
              id,
              title,
              content,
              description,
              banner_url,
              category,
              author_id,
              likes,
              created_at,
              is_featured,
              users!author_id (
                name,
                usn
              )
            `
            )
            .order("created_at", { ascending: false });

          if (blogsError) {
            console.error("Error fetching blogs:", blogsError);
            setBlogError("Failed to load blogs");
          } else if (blogsData) {
            // Transform the data to match our Blog interface
            const transformedBlogs: Blog[] = (
              blogsData as unknown as BlogWithUser[]
            ).map((blog) => ({
              id: blog.id,
              title: blog.title,
              content: blog.content,
              description: blog.description,
              banner_url: blog.banner_url,
              category: blog.category,
              author_id: blog.author_id,
              likes: blog.likes,
              created_at: blog.created_at,
              is_featured: blog.is_featured,
              author: {
                name: blog.users?.name || "Anonymous",
                usn: blog.users?.usn || "N/A",
              },
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

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAnnouncementError("You must be logged in to post announcements");
        return;
      }

      // Verify user is a Lead
      if (userProfile?.role !== "Lead") {
        setAnnouncementError("Only Leads can post announcements");
        return;
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert([
          {
            message: announcementInput.trim(),
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "42501") {
          setAnnouncementError(
            "You don't have permission to post announcements"
          );
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

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAnnouncementError("You must be logged in to delete announcements");
        return;
      }

      // Verify user is a Lead
      if (userProfile?.role !== "Lead") {
        setAnnouncementError("Only Leads can delete announcements");
        return;
      }

      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcementId);

      if (error) {
        if (error.code === "42501") {
          setAnnouncementError(
            "You don't have permission to delete announcements"
          );
        } else {
          throw error;
        }
        return;
      }

      setAnnouncements(announcements.filter((a) => a.id !== announcementId));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setAnnouncementError("Failed to delete announcement. Please try again.");
    }
  };

  const handleQuizSubmit = async () => {
    try {
      setQuizError(null);

      const { name, code, link, responseLink, description, difficulty } =
        quizInput;

      // Enhanced validation
      if (!name.trim()) {
        setQuizError("Quiz name is required");
        return;
      }
      if (!code.trim()) {
        setQuizError("Quiz code is required");
        return;
      }
      if (!link.trim() || !link.startsWith("http")) {
        setQuizError("Valid quiz link is required");
        return;
      }
      if (!responseLink.trim() || !responseLink.startsWith("http")) {
        setQuizError("Valid response link is required");
        return;
      }
      if (!description.trim()) {
        setQuizError("Description is required");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setQuizError("You must be logged in to post quizzes");
        return;
      }

      // Verify user is a Quizmaster
      if (userProfile?.role !== "Quizmaster") {
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
        .insert([
          {
            name: name.trim(),
            code: code.trim(),
            link: link.trim(),
            responseLink: responseLink.trim(),
            description: description.trim(),
            difficulty,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "42501") {
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
          created_at: new Date().toISOString(),
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

      if (!window.confirm("Are you sure you want to delete this quiz?")) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setQuizError("You must be logged in to delete quizzes");
        return;
      }

      // Verify user is a Quizmaster
      if (userProfile?.role !== "Quizmaster") {
        setQuizError("Only Quizmasters can delete quizzes");
        return;
      }

      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", quizId);

      if (error) {
        if (error.code === "42501") {
          setQuizError("You don't have permission to delete quizzes");
        } else {
          throw error;
        }
        return;
      }

      setQuizzes(quizzes.filter((q) => q.id !== quizId));
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
      if (!link.trim() || !link.startsWith("http")) {
        setNewsError("Valid news link is required");
        return;
      }
      if (!date) {
        setNewsError("Date is required");
        return;
      }
      if (!image.trim() || !image.startsWith("http")) {
        setNewsError("Valid image URL is required");
        return;
      }
      if (!description.trim()) {
        setNewsError("Description is required");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setNewsError("You must be logged in to post news");
        return;
      }

      // Verify user is a News-Master
      if (userProfile?.role !== "News-Master") {
        setNewsError("Only News-Masters can post news");
        return;
      }

      const { data, error } = await supabase
        .from("news")
        .insert([
          {
            title: title.trim(),
            link: link.trim(),
            date,
            image: image.trim(),
            description: description.trim(),
          },
        ])
        .select("id, title, link, date, image, description")
        .single();

      if (error) {
        if (error.code === "42501") {
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
          description: "",
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

      if (!window.confirm("Are you sure you want to delete this news item?")) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setNewsError("You must be logged in to delete news");
        return;
      }

      // Verify user is a News-Master
      if (userProfile?.role !== "News-Master") {
        setNewsError("Only News-Masters can delete news");
        return;
      }

      const { error } = await supabase.from("news").delete().eq("id", newsId);

      if (error) {
        if (error.code === "42501") {
          setNewsError("You don't have permission to delete news");
        } else {
          throw error;
        }
        return;
      }

      setNews(news.filter((n) => n.id !== newsId));
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
      if (!link.trim() || !link.startsWith("http")) {
        setMovieError("Valid movie link is required");
        return;
      }
      if (!image.trim() || !image.startsWith("http")) {
        setMovieError("Valid image URL is required");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMovieError("You must be logged in to add movies");
        return;
      }

      // Verify user is a Suggestion Manager
      if (userProfile?.role !== "Suggestion Manager") {
        setMovieError("Only Suggestion Managers can add movies");
        return;
      }

      const { data, error } = await supabase
        .from("movies")
        .insert([
          {
            title: title.trim(),
            link: link.trim(),
            image: image.trim(),
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "42501") {
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
          image: "",
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

      if (!window.confirm("Are you sure you want to delete this movie?")) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMovieError("You must be logged in to delete movies");
        return;
      }

      // Verify user is a Suggestion Manager
      if (userProfile?.role !== "Suggestion Manager") {
        setMovieError("Only Suggestion Managers can delete movies");
        return;
      }

      const { error } = await supabase
        .from("movies")
        .delete()
        .eq("title", title);

      if (error) {
        if (error.code === "42501") {
          setMovieError("You don't have permission to delete movies");
        } else {
          throw error;
        }
        return;
      }

      setMovies(movies.filter((m) => m.title !== title));
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

      if (!window.confirm("Are you sure you want to delete this blog?")) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBlogError("You must be logged in to delete blogs");
        return;
      }

      // Verify user is a Blog Manager
      if (userProfile?.role !== "Blog Manager") {
        setBlogError("Only Blog Managers can delete blogs");
        return;
      }

      const { error } = await supabase.from("blogs").delete().eq("id", blogId);

      if (error) {
        if (error.code === "42501") {
          setBlogError("You don't have permission to delete blogs");
        } else {
          throw error;
        }
        return;
      }

      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      setBlogError("Failed to delete blog. Please try again.");
    } finally {
      setIsBlogLoading(false);
    }
  };

  const handleToggleFeatured = async (
    blogId: string,
    currentFeatured: boolean
  ) => {
    try {
      setBlogError(null);
      setIsBlogLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBlogError("You must be logged in to feature blogs");
        return;
      }

      // Verify user is a Blog Manager
      if (userProfile?.role !== "Blog Manager") {
        setBlogError("Only Blog Managers can feature blogs");
        return;
      }

      // If we're featuring a blog, unfeature all other blogs first
      if (!currentFeatured) {
        const { error: unfeatureError } = await supabase
          .from("blogs")
          .update({ is_featured: false })
          .eq("is_featured", true);

        if (unfeatureError) throw unfeatureError;
      }

      // Toggle the featured status
      const { error: updateError } = await supabase
        .from("blogs")
        .update({ is_featured: !currentFeatured })
        .eq("id", blogId);

      if (updateError) throw updateError;

      // Update local state
      setBlogs(
        blogs.map((blog) =>
          blog.id === blogId
            ? { ...blog, is_featured: !currentFeatured }
            : { ...blog, is_featured: false }
        )
      );
    } catch (err) {
      console.error("Error toggling featured status:", err);
      setBlogError("Failed to update featured status. Please try again.");
    } finally {
      setIsBlogLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      console.log("Starting message fetch..."); // Debug log
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found for message fetch"); // Debug log
        return;
      }

      console.log("Fetching messages for role:", userProfile?.role); // Debug log

      if (!userProfile?.role) {
        console.log("No role found in userProfile"); // Debug log
        return;
      }

      let query = supabase
        .from("messages")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      // If user is Lead, show all messages they sent
      if (userProfile.role === "Lead") {
        console.log("Fetching messages sent by Lead:", user.id); // Debug log
        query = query.eq("sender_id", user.id);
      } else if (userProfile.role === "student") {
        console.log("Fetching messages for Students"); // Debug log
        query = query.eq("recipient_role", "student");
      } else {
        console.log("Fetching messages for role:", userProfile.role); // Debug log
        query = query.eq("recipient_role", userProfile.role);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error); // Debug log
        throw error;
      }

      console.log("Fetched messages:", data); // Debug log
      if (data) {
        setMessages(data);
        console.log("Messages state updated with:", data.length, "messages"); // Debug log
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    console.log("userProfile changed:", userProfile); // Debug log
    if (userProfile?.role) {
      console.log("Fetching messages for role:", userProfile.role); // Debug log
      fetchMessages();
    }
  }, [userProfile?.role]); // Only depend on the role, not the entire userProfile object

  const handleSendMessage = async () => {
    try {
      setMessageError(null);
      setIsMessageLoading(true);

      if (!newMessage.recipient_role) {
        setMessageError("Please select a recipient");
        return;
      }

      if (!newMessage.content.trim()) {
        setMessageError("Message cannot be empty");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessageError("You must be logged in to send messages");
        return;
      }

      // Verify user is a Lead
      if (userProfile?.role !== "Lead") {
        setMessageError("Only Leads can send messages");
        return;
      }

      console.log("Sending message as Lead:", user.id); // Debug log

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: user.id,
            sender_name: userProfile.name,
            recipient_role: newMessage.recipient_role,
            content: newMessage.content.trim(),
            status: "pending",
            is_deleted: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error); // Debug log
        throw error;
      }

      if (data) {
        console.log("Message sent successfully:", data); // Debug log
        // Update messages immediately
        setMessages((prevMessages) => [data, ...prevMessages]);
        setNewMessage({ recipient_role: "", content: "" });

        // Refresh messages to ensure consistency
        await fetchMessages();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessageError("Failed to send message. Please try again.");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      setMessageError(null);
      setIsMessageLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessageError("You must be logged in to delete messages");
        return;
      }

      // First, get the message to check if user has permission to delete it
      const { data: message, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("id", messageId)
        .single();

      if (fetchError) throw fetchError;

      // Check if user is either the sender or the recipient
      const isSender = message.sender_id === user.id;
      const isRecipient = message.recipient_role === userProfile?.role;

      if (!isSender && !isRecipient) {
        setMessageError("You don't have permission to delete this message");
        return;
      }

      // Perform the soft delete
      const { error: updateError } = await supabase
        .from("messages")
        .update({ is_deleted: true })
        .eq("id", messageId);

      if (updateError) throw updateError;

      // Update local state by filtering out the deleted message
      setMessages(messages.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
      setMessageError("Failed to delete message. Please try again.");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleUpdateMessageStatus = async (
    messageId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      setMessageError(null);
      setIsMessageLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessageError("You must be logged in to update message status");
        return;
      }

      const { error } = await supabase
        .from("messages")
        .update({ status: newStatus })
        .eq("id", messageId);

      if (error) throw error;

      setMessages(
        messages.map((m) =>
          m.id === messageId ? { ...m, status: newStatus } : m
        )
      );
    } catch (err) {
      console.error("Error updating message status:", err);
      setMessageError("Failed to update message status. Please try again.");
    } finally {
      setIsMessageLoading(false);
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
      {/* Edit Profile Button */}
      <div className="flex justify-end mb-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Profile
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={() => setIsPortfolioModalOpen(true)}
        >
          Portfolio
        </button>
      </div>
      {/* Profile Photo */}
      {userProfile.profile_photo && (
        <div className="flex justify-center mb-4">
          <img
            src={userProfile.profile_photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
          />
        </div>
      )}
      <div className="flex items-center space-x-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {userProfile.name}
          </h2>
          <p className="text-gray-600">{userProfile.usn}</p>
          <p className="text-sm text-gray-500 capitalize">{userProfile.role}</p>
          {/* Social Icons */}
          <div className="flex space-x-3 mt-2">
            {userProfile.github && (
              <a
                href={`https://github.com/${userProfile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="text-gray-700 hover:text-black"
              >
                <FaGithub size={22} />
              </a>
            )}
            {userProfile.linkedin && (
              <a
                href={`https://linkedin.com/in/${userProfile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-blue-700 hover:text-blue-900"
              >
                <FaLinkedin size={22} />
              </a>
            )}
            {userProfile.instagram && (
              <a
                href={`https://instagram.com/${userProfile.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="text-pink-600 hover:text-pink-800"
              >
                <FaInstagram size={22} />
              </a>
            )}
            {userProfile.twitter && (
              <a
                href={`https://twitter.com/${userProfile.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                className="text-blue-500 hover:text-blue-700"
              >
                <FaTwitter size={22} />
              </a>
            )}
          </div>
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
          Member since{" "}
          {new Date(userProfile.created_at || new Date()).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-4 text-gray-700 text-lg mb-6">
        <div>
          <strong>Email:</strong> {userProfile.email}
        </div>
        {userProfile.portfolio && (
          <div>
            <strong>Portfolio:</strong>{" "}
            <a
              href={userProfile.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {userProfile.portfolio}
            </a>
          </div>
        )}
        {userProfile.leetcode && (
          <div>
            <strong>LeetCode:</strong>{" "}
            <a
              href={userProfile.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {userProfile.leetcode}
            </a>
          </div>
        )}
        {userProfile.resume_pdf && (
          <div>
            <strong>Resume (PDF):</strong>{" "}
            <a
              href={userProfile.resume_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              View Resume
            </a>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Achievements
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Likes Received</span>
            <span className="font-medium text-gray-900">
              {userProfile.reputation || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Role Instructions Section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Role Guidelines
        </h3>
        <div className="bg-blue-50 rounded-lg p-4">
          {userProfile.role === "Lead" && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">
                Lead Responsibilities:
              </h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Oversee overall progress and success of the domain</li>
                <li>Manage and organize domain-specific events</li>
                <li>Announce important dates and updates to club members</li>
                <li>
                  Coordinate with admin for calendar updates and event
                  scheduling
                </li>
                <li>Launch and manage domain banners for special sessions</li>
                <li>
                  Take responsibility for domain's success and performance
                </li>
                <li>Manage domain logo usage and branding</li>
                <li>Set and communicate event dates and timings</li>
                <li>Ensure smooth coordination between team members</li>
                <li>Maintain professional communication with club members</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-800 font-medium">Key Focus Areas:</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 mt-2">
                  <li>Event Management & Coordination</li>
                  <li>Team Leadership & Communication</li>
                  <li>Domain Success & Progress Tracking</li>
                  <li>Brand Management & Visibility</li>
                </ul>
              </div>
            </div>
          )}

          {userProfile.role === "Quizmaster" && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">
                Quizmaster Responsibilities:
              </h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Create and manage quizzes for the club</li>
                <li>Provide clear quiz instructions and difficulty levels</li>
                <li>Ensure quiz links and response forms are working</li>
                <li>Remove outdated or completed quizzes</li>
                <li>Monitor quiz participation and results</li>
                <li>
                  Report quiz results to admin/domain lead for winner
                  announcements
                </li>
                <li>Coordinate with leads for quiz result announcements</li>
              </ul>
            </div>
          )}

          {userProfile.role === "News-Master" && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">
                News-Master Responsibilities:
              </h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Share relevant news and updates</li>
                <li>Ensure news items are accurate and verified</li>
                <li>Include proper sources and links</li>
                <li>Keep news section updated and organized</li>
                <li>Remove outdated or irrelevant news</li>
              </ul>
            </div>
          )}

          {userProfile.role === "Suggestion Manager" && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">
                Suggestion Manager Responsibilities:
              </h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Curate and share educational content</li>
                <li>Add movies, documentaries, and learning resources</li>
                <li>Ensure content is appropriate and valuable</li>
                <li>Keep content links updated and working</li>
                <li>Organize content by categories or themes</li>
                <li>Monitor admin's approval/rejection decisions</li>
                <li>Add approved movie suggestions to the content library</li>
                <li>
                  Review rejected suggestions to understand content guidelines
                </li>
              </ul>
            </div>
          )}

          {userProfile.role === "Blog Manager" && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">
                Blog Manager Responsibilities:
              </h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Review and manage blog content</li>
                <li>Ensure blogs follow community guidelines</li>
                <li>Monitor blog engagement and reports</li>
                <li>Remove inappropriate or reported content</li>
                <li>Maintain quality and relevance of blog posts</li>
                <li>Feature blogs that are relevant to the club</li>
              </ul>
            </div>
          )}

          {userProfile.role === "admin" && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">
                Admin Responsibilities:
              </h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Manage and oversee all club activities and members</li>
                <li>Approve or reject movie suggestions from members</li>
                <li>
                  Monitor and maintain content quality across all sections
                </li>
                <li>Manage user roles and permissions</li>
                <li>Review and moderate blog content</li>
                <li>Coordinate with domain leads for event management</li>
                <li>
                  Handle quiz result announcements and winner declarations
                </li>
                <li>Maintain club calendar and event schedules</li>
                <li>Ensure smooth operation of all club features</li>
                <li>Address member concerns and feedback</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Announcement Section only for Lead users */}
      {userProfile.role === "Lead" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Megaphone className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Announcements
            </h3>
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
                      Posted on{" "}
                      {new Date(announcement.created_at).toLocaleString()}
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
      {userProfile.role === "Quizmaster" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Quiz Management
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Quiz Name"
                  value={quizInput.name}
                  onChange={(e) =>
                    setQuizInput({ ...quizInput, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Quiz Code"
                  value={quizInput.code}
                  onChange={(e) =>
                    setQuizInput({ ...quizInput, code: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Quiz Link"
                  value={quizInput.link}
                  onChange={(e) =>
                    setQuizInput({ ...quizInput, link: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Response Link"
                  value={quizInput.responseLink}
                  onChange={(e) =>
                    setQuizInput({ ...quizInput, responseLink: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <textarea
              placeholder="Description"
              value={quizInput.description}
              onChange={(e) =>
                setQuizInput({ ...quizInput, description: e.target.value })
              }
              className="w-full p-2 border rounded min-h-[100px] resize-y"
            />
            <select
              value={quizInput.difficulty}
              onChange={(e) =>
                setQuizInput({ ...quizInput, difficulty: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {quizError && <p className="text-red-500 text-sm">{quizError}</p>}
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
                    <p className="text-sm text-gray-600">
                      Difficulty: {quiz.difficulty}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {quiz.description}
                    </p>
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
                <p className="text-gray-500 text-center py-4">
                  No quizzes added yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* News Section for News-Master users */}
      {userProfile.role === "News-Master" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              News Management
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="News Title"
                value={newsInput.title}
                onChange={(e) =>
                  setNewsInput({ ...newsInput, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
              <input
                type="url"
                placeholder="News Link"
                value={newsInput.link}
                onChange={(e) =>
                  setNewsInput({ ...newsInput, link: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
              <input
                type="date"
                value={newsInput.date}
                onChange={(e) =>
                  setNewsInput({ ...newsInput, date: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newsInput.image}
                onChange={(e) =>
                  setNewsInput({ ...newsInput, image: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isNewsLoading}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newsInput.description}
              onChange={(e) =>
                setNewsInput({ ...newsInput, description: e.target.value })
              }
              className="w-full p-2 border rounded min-h-[100px] resize-y"
              disabled={isNewsLoading}
            />
            {newsError && <p className="text-red-500 text-sm">{newsError}</p>}
            <button
              onClick={handleNewsSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isNewsLoading}
            >
              {isNewsLoading ? "Adding News..." : "Add News"}
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
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(item.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
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
                <p className="text-gray-500 text-center py-4">
                  No news items added yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movie Management Section for Suggestion Manager users */}
      {userProfile.role === "Suggestion Manager" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Film className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Content Management
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title (Movie/Documentary)"
                value={movieInput.title}
                onChange={(e) =>
                  setMovieInput({ ...movieInput, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isMovieLoading}
              />
              <input
                type="url"
                placeholder="Content Link"
                value={movieInput.link}
                onChange={(e) =>
                  setMovieInput({ ...movieInput, link: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isMovieLoading}
              />
              <input
                type="url"
                placeholder="Thumbnail URL"
                value={movieInput.image}
                onChange={(e) =>
                  setMovieInput({ ...movieInput, image: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={isMovieLoading}
              />
            </div>
            {movieError && <p className="text-red-500 text-sm">{movieError}</p>}
            <button
              onClick={handleMoviesSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isMovieLoading}
            >
              {isMovieLoading ? "Adding Content..." : "Add Content"}
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
                        <h4 className="font-medium text-gray-900">
                          {movie.title}
                        </h4>
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
                <p className="text-gray-500 text-center py-4">
                  No content added yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movie Suggestions Section for Suggestion Manager users */}
      {userProfile.role === "Suggestion Manager" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Film className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Movie Suggestions
            </h3>
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
                        <span>
                          Date:{" "}
                          {new Date(suggestion.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            suggestion.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : suggestion.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {suggestion.status.charAt(0).toUpperCase() +
                            suggestion.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No movie suggestions yet
              </p>
            )}
          </div>
        </div>
      )}

      {/* Blog Management Section for Blog Manager users */}
      {userProfile.role === "Blog Manager" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Blog Management
              </h3>
            </div>
            <span className="text-sm text-gray-500">
              Total Blogs: {blogs.length}
            </span>
          </div>
          <div className="space-y-4">
            {blogError && <p className="text-red-500 text-sm">{blogError}</p>}
            <div className="space-y-4">
              {isBlogLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                      blog.is_featured ? "bg-yellow-50 border-yellow-200" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {blog.title}
                          </h3>
                          {blog.is_featured && (
                            <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {blog.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>By: {blog.author?.name || "Anonymous"}</span>
                          <span>Category: {blog.category}</span>
                          <span>Likes: {blog.likes || 0}</span>
                          <span>
                            Created:{" "}
                            {new Date(blog.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleFeatured(blog.id, blog.is_featured)
                          }
                          className={`p-2 rounded-full transition-colors ${
                            blog.is_featured
                              ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={
                            blog.is_featured ? "Unfeature blog" : "Feature blog"
                          }
                          disabled={isBlogLoading}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete blog"
                          disabled={isBlogLoading}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
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

      {/* Message Section for Lead users */}
      {userProfile.role === "Lead" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Megaphone className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Send Messages
            </h3>
          </div>
          <div className="space-y-4">
            <select
              value={newMessage.recipient_role}
              onChange={(e) =>
                setNewMessage({ ...newMessage, recipient_role: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select Recipient</option>
              <option value="Blog Manager">Blog Manager</option>
              <option value="Quizmaster">Quizmaster</option>
              <option value="Suggestion Manager">Suggestion Manager</option>
              <option value="News-Master">News-Master</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
            <textarea
              value={newMessage.content}
              onChange={(e) =>
                setNewMessage({ ...newMessage, content: e.target.value })
              }
              placeholder="Type your message..."
              className="w-full p-2 border rounded min-h-[100px] resize-y"
            />
            {messageError && (
              <p className="text-red-500 text-sm">{messageError}</p>
            )}
            <button
              onClick={handleSendMessage}
              disabled={isMessageLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isMessageLoading ? "Sending..." : "Send Message"}
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Sent Messages
            </h4>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          To: {message.recipient_role}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            message.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : message.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {message.status.charAt(0).toUpperCase() +
                            message.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{message.content}</p>
                      <p className="text-sm text-gray-500">
                        Sent on {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete message"
                      disabled={isMessageLoading}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No messages sent yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Section for other roles */}
      {userProfile.role !== "Lead" && userProfile.role !== "student" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Megaphone className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Messages from Lead
            </h3>
          </div>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        From: {message.sender_name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          message.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : message.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {message.status.charAt(0).toUpperCase() +
                          message.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{message.content}</p>
                    <p className="text-sm text-gray-500">
                      Received on{" "}
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateMessageStatus(message.id, "approved")
                          }
                          className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                          title="Approve message"
                          disabled={isMessageLoading}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateMessageStatus(message.id, "rejected")
                          }
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Reject message"
                          disabled={isMessageLoading}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete message"
                      disabled={isMessageLoading}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No messages received
              </p>
            )}
          </div>
        </div>
      )}

      {/* Message Section for students */}
      {userProfile.role === "student" && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Megaphone className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Messages from Lead
            </h3>
          </div>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      From: {message.sender_name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        message.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : message.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {message.status.charAt(0).toUpperCase() +
                        message.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{message.content}</p>
                  <p className="text-sm text-gray-500">
                    Received on {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No messages received
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                let profilePhotoUrl = editProfile.profile_photo;
                try {
                  if (profilePhotoFile) {
                    profilePhotoUrl = await uploadToCloudinary(
                      profilePhotoFile
                    );
                  }
                  // Update Supabase user row
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  if (!user) throw new Error("Not authenticated");
                  console.log("Updating user with id:", user.id);
                  const { data, error } = await supabase
                    .from("users")
                    .update({
                      profile_photo: profilePhotoUrl,
                      github: editProfile.github,
                      linkedin: editProfile.linkedin,
                      instagram: editProfile.instagram,
                      twitter: editProfile.twitter,
                    })
                    .eq("id", user.id)
                    .select();
                  console.log("Update result:", data, error);
                  if (error) throw error;
                  if (!data || data.length === 0) {
                    alert(
                      "No user row was updated. Please check your user ID and table schema."
                    );
                    return;
                  }
                  setUserProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          profile_photo: profilePhotoUrl,
                          github: editProfile.github,
                          linkedin: editProfile.linkedin,
                          instagram: editProfile.instagram,
                          twitter: editProfile.twitter,
                        }
                      : prev
                  );
                  setIsEditModalOpen(false);
                } catch (err) {
                  alert("Failed to update profile. Please try again.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePhotoFile(e.target.files[0]);
                      setEditProfile({
                        ...editProfile,
                        profile_photo: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                  className="w-full"
                />
                {editProfile.profile_photo && (
                  <img
                    src={editProfile.profile_photo}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mt-2 border"
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">GitHub ID</label>
                <input
                  type="text"
                  value={editProfile.github}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, github: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="GitHub username"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">LinkedIn ID</label>
                <input
                  type="text"
                  value={editProfile.linkedin}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, linkedin: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="LinkedIn profile ID"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Instagram ID</label>
                <input
                  type="text"
                  value={editProfile.instagram}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Instagram username"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  X (Twitter) ID
                </label>
                <input
                  type="text"
                  value={editProfile.twitter}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, twitter: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="X (Twitter) username"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsPortfolioModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Portfolio Links</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPortfolioError(null);
                try {
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  if (!user) throw new Error("Not authenticated");
                  const { data, error } = await supabase
                    .from("users")
                    .update({
                      portfolio: portfolioLinks.portfolio,
                      leetcode: portfolioLinks.leetcode,
                      resume_pdf: portfolioLinks.resume_pdf,
                    })
                    .eq("id", user.id)
                    .select();
                  if (error) throw error;
                  if (!data || data.length === 0) {
                    setPortfolioError(
                      "No user row was updated. Please check your user ID and table schema."
                    );
                    return;
                  }
                  setUserProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          portfolio: portfolioLinks.portfolio,
                          leetcode: portfolioLinks.leetcode,
                          resume_pdf: portfolioLinks.resume_pdf,
                        }
                      : prev
                  );
                  setIsPortfolioModalOpen(false);
                } catch (err) {
                  setPortfolioError(
                    "Failed to update portfolio links. Please try again."
                  );
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-1">
                  Portfolio Link
                </label>
                <input
                  type="url"
                  value={portfolioLinks.portfolio}
                  onChange={(e) =>
                    setPortfolioLinks({
                      ...portfolioLinks,
                      portfolio: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://your-portfolio.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  LeetCode Profile Link
                </label>
                <input
                  type="url"
                  value={portfolioLinks.leetcode}
                  onChange={(e) =>
                    setPortfolioLinks({
                      ...portfolioLinks,
                      leetcode: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://leetcode.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Google Drive Resume PDF Link
                </label>
                <input
                  type="url"
                  value={portfolioLinks.resume_pdf}
                  onChange={(e) =>
                    setPortfolioLinks({
                      ...portfolioLinks,
                      resume_pdf: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://drive.google.com/your-resume-link"
                />
              </div>
              {portfolioError && (
                <p className="text-red-500 text-sm">{portfolioError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
