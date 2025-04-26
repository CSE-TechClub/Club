// --- existing imports ---
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Brain,
  Shield,
  TrendingUp,
  UserPlus,
  Settings,
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
interface MoviesItem {
  title: string;
  link: string;
  image: string;
}

// --- component ---
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

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

  const [moviesInput, setMoviesInput] = useState<MoviesItem>({
    title: "",
    link: "",
    image: "",
  });

  const [totalMembers, setTotalMembers] = useState(0);
  const [quizCompletions, setQuizCompletions] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [movies, setMovies] = useState<MoviesItem[]>([]);

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
    };

    fetchData();
  }, [navigate]);

  const stats: StatCard[] = [
    {
      title: "Total Users",
      value: totalMembers,
      icon: Users,
      color: "text-google-blue",
    },
    {
      title: "Active Quizzes",
      value: quizzes.length,
      icon: Brain,
      color: "text-google-red",
    },
    {
      title: "Member Count",
      value: adminCount,
      icon: Shield,
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
      const newMovie = {
        title,
        link,
        image,
      };
      const { error } = await supabase.from("movies").insert([newMovie]);
      if (!error) {
        setMovies([newMovie, ...movies]);
        setMoviesInput({
          title: "",
          link: "",
          image: "",
        });
      }
    }
  };

  const handleDeleteMovie = async (index: number) => {
    const { title } = movies[index];
    const { error } = await supabase.from("movies").delete().eq("id", title);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button className="btn-primary flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add Admin</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-gray-600 text-sm">Link: {m.link}</p>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
