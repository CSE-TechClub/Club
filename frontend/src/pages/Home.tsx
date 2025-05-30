import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  Brain,
  Cpu,
  Shield,
  Users,
  LucideBrainCircuit,
  UserCircle2,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { mockMembers } from "../pages/Members";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Calendar from "../components/Calendar";

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

interface Quiz {
  id: string;
  name: string;
  code: string;
  link: string;
  description: string;
  difficulty: string;
}
interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  image: string;
  description: string;
}
interface MovieRating {
  rating: number;
}

interface SuggestionItem {
  id: string;
  title: string;
  link: string;
  image: string;
  averageRating?: number;
  totalRatings?: number;
  ratings?: MovieRating[];
}

interface Blog {
  id: string;
  title: string;
  category: string;
}

const subclubs = [
  {
    name: "Web Wizards",
    icon: Code2,
    description:
      "Master the art of web development with modern frameworks and tools.",
    color: "text-blue-600",
    link: "/web-dev",
  },
  {
    name: "AI Avengers",
    icon: Brain,
    description:
      "Explore artificial intelligence, machine learning, and data science.",
    color: "text-red-600",
    link: "/ai",
  },
  {
    name: "Dev Dynamos",
    icon: Cpu,
    description:
      "Build powerful applications and learn software engineering practices.",
    color: "text-yellow-600",
    link: "/devops",
  },
  {
    name: "Cyber Scholars",
    icon: Shield,
    description:
      "Dive into cybersecurity, ethical hacking, and network protection from basic.",
    color: "text-green-600",
    link: "/cyber",
  },
];

// const movies = [
//   {
//     title: "Radhe shyam",
//     image:
//       "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Radhe_Shyam.jpg/250px-Radhe_Shyam.jpg",
//     link: "https://www.primevideo.com/region/eu/detail/Radhe-Shyam-Telugu/0QXK16A045FAMGI21LGHGK0X9U",
//   },
// ];

const Websites = [
  {
    title: "Discuza Forum",
    imgurl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgZoD-qhoyKJOMX9-7qr3L2OGEl0VsXTvJ7A&s",
    contributors: ["Gagan TP", "Abhilash TK"],
    descritption:
      "Engage in meaningful discussions, share knowledge, and collaborate with the community. To use the forum, make sure you have a valid email address and a secure password to register or log in.",
    link: "https://discuza.in/login",
  },
  {
    title: "ChartWise",
    imgurl:
      "https://stom-breaker-07.github.io/Dynamic_DataViz/assets/pink-AgZdhpKt.jpg",
    contributors: ["Chinmay L"],
    descritption:
      "The Smart Way to Visualize DataExperience the power of interactive and dynamic charting with multiple graph types and real-time data manipulation.",
    link: "https://stom-breaker-07.github.io/Dynamic_DataViz/",
  },
  {
    title: "RupeeTracker",
    imgurl: "https://rupeetracker.vercel.app/assets/icons/logo.svg",
    contributors: ["Rudresh "],
    descritption:
      "This is the platform where the people can easily trrack thier product price from E-COMMERCE WEBSITE like AMAZON FLIPKART ( currently this website working only on AMAZON) this platform Helps users or customers to aviod business strategies of E-COMMERCE company by giving fake offers",
    link: "https://rupeetracker.vercel.app/ ",
  },
  {
    title: "Techie Notes",
    imgurl: "https://kit-student-web.vercel.app/assets/book-bE_zQ1KF.svg",
    contributors: ["Rudresh M"],
    descritption:
      "Techie notes is the one stop platform for all VTU students they can easily find their notes VTU circles and other VTU notifications",
    link: "https://kit-student-web.vercel.app/home ",
  },
  // {
  //   title: "",
  //   imgurl: "",
  //   contributors: [""],
  //   descritption: "",
  //   link: " ",
  // },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [totalMembers, setTotalMembers] = useState(0);
  const [quizCompletions, setQuizCompletions] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  // Announcement carousel state
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);

  // News & Quizzes & Movies
  const [news, setNews] = useState<NewsItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [movies, setMovies] = useState<SuggestionItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<SuggestionItem | null>(
    null
  );
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Add new state for suggestion modal
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats: StatCard[] = [
    {
      title: "Users",
      value: totalMembers,
      icon: UserCircle2,
      color: "text-google-blue",
    },
    {
      title: "Active Quizzes",
      value: quizzes.length,
      icon: LucideBrainCircuit,
      color: "text-google-red",
    },
    {
      title: "Members",
      value: adminCount,
      icon: Users,
      color: "text-google-yellow",
    },
    {
      title: "Quiz Completions",
      value: quizCompletions,
      icon: TrendingUp,
      color: "text-google-green",
    },
  ];

  const AnimatedStat = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
      const controls = animate(count, value, {
        duration: 1,
        ease: "easeOut",
      });

      return controls.stop; // cleanup
    }, [count, value]);

    return (
      <motion.span className="text-xl font-semibold text-gray-900">
        {rounded}
      </motion.span>
    );
  };

  // Update the rating calculation with proper types
  const calculateAverageRating = (
    ratings: MovieRating[]
  ): { averageRating: number | null; totalRatings: number } => {
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum: number, r: MovieRating) => sum + r.rating, 0) /
          totalRatings
        : null;
    return { averageRating, totalRatings };
  };

  // Fetch announcements + subscribe to realtime
  useEffect(() => {
    const fetchData = async () => {
      // ✨ Existing fetch code ✨

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (announcementsData) {
        setAnnouncements(announcementsData.map((a: any) => a.message));
      }

      // Fetch quizzes
      const { data: quizzesData } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });
      if (quizzesData) {
        setQuizzes(quizzesData as Quiz[]);
      }

      // Fetch news
      const { data: newsData } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      if (newsData) {
        setNews(newsData as NewsItem[]);
      }

      // Fetch movies
      const { data: moviesData } = await supabase
        .from("movies")
        .select(
          `
          *,
          ratings:movie_ratings(
            rating
          )
        `
        )
        .order("created_at", { ascending: false });
      if (moviesData) {
        const moviesWithRatings = moviesData.map((movie) => {
          const ratings = (movie.ratings || []) as MovieRating[];
          const { averageRating, totalRatings } =
            calculateAverageRating(ratings);

          return {
            ...movie,
            averageRating,
            totalRatings,
            ratings: undefined,
          };
        });
        setMovies(moviesWithRatings as SuggestionItem[]);
      }

      // Fetch blogs for quick links
      const { data: blogsData } = await supabase
        .from("blogs")
        .select("id, title, category")
        .order("created_at", { ascending: false })
        .limit(5); // Limit to 5 most recent blogs

      if (blogsData) {
        setBlogs(blogsData as Blog[]);
      }

      // ✨ ✨ ✨ New added code starts here ✨ ✨ ✨

      // Fetch total members
      const { count: memberCount } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true });
      if (typeof memberCount === "number") {
        setTotalMembers(memberCount);
      }

      // Fetch quiz completions
      const { data: statsData, error: statsError } = await supabase
        .from("quiz_stats")
        .select("total_quiz_insertions")
        .eq("id", 1)
        .single();
      if (!statsError && statsData) {
        setQuizCompletions(statsData.total_quiz_insertions);
      }

      // Set admin count
      setAdminCount(mockMembers.length);

      // ✨ ✨ ✨ New added code ends here ✨ ✨ ✨
    };

    fetchData();
  }, [navigate]);

  // Announcement carousel rotation
  useEffect(() => {
    if (paused || announcements.length === 0) return;
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentAnnouncement((i) => (i + 1) % announcements.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(iv);
  }, [paused, announcements]);

  // Update the handleRatingSubmit function
  const handleRatingSubmit = async () => {
    if (!selectedMovie || !userRating) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login to rate movies");
        return;
      }

      // Check if user has already rated this movie
      const { data: existingRating } = await supabase
        .from("movie_ratings")
        .select("id")
        .eq("movie_id", selectedMovie.id)
        .eq("user_id", user.id)
        .single();

      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from("movie_ratings")
          .update({ rating: userRating })
          .eq("id", existingRating.id);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase.from("movie_ratings").insert([
          {
            movie_id: selectedMovie.id,
            user_id: user.id,
            rating: userRating,
          },
        ]);

        if (error) throw error;
      }

      // Refresh movies to update ratings
      const { data: updatedMovies } = await supabase
        .from("movies")
        .select(
          `
          *,
          ratings:movie_ratings(
            rating
          )
        `
        )
        .order("created_at", { ascending: false });

      if (updatedMovies) {
        const moviesWithRatings = updatedMovies.map((movie) => {
          const ratings = (movie.ratings || []) as MovieRating[];
          const { averageRating, totalRatings } =
            calculateAverageRating(ratings);

          return {
            ...movie,
            averageRating,
            totalRatings,
            ratings: undefined,
          };
        });
        setMovies(moviesWithRatings as SuggestionItem[]);
      }

      setShowRatingModal(false);
      setSelectedMovie(null);
      setUserRating(0);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  // Add handleSuggestionSubmit function
  const handleSuggestionSubmit = async () => {
    if (!suggestionText.trim()) {
      alert("Please enter a movie suggestion");
      return;
    }

    try {
      setIsSubmitting(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login to submit a suggestion");
        return;
      }

      const { error } = await supabase.from("movie_suggestions").insert([
        {
          movie_name: suggestionText.trim(),
          user_id: user.id,
          additional_details: "",
        },
      ]);

      if (error) throw error;

      alert("Thank you for your suggestion!");
      setShowSuggestionModal(false);
      setSuggestionText("");
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl  text-gray-900 mb-4">
          Welcome to Students Club
        </h1>
        <p className="text-xl text-gray-600">
          Join our community of passionate learners and innovators
        </p>
      </div>

      {/* Sub-clubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {subclubs.map((club) => (
          <Link to={club.link} key={club.name} className="group">
            <div className="card hover:shadow-lg transition-shadow p-6">
              <div className={`${club.color} mb-4`}>
                <club.icon className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
              <p className="text-gray-600">{club.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Announcements */}
      <div className="mt-16">
        <h2 className="text-3xl text-gray-900 my-8 text-center">
          Announcements📌
        </h2>
        {announcements.length > 0 ? (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`max-w-5xl bg-white shadow-xl rounded-lg px-8 py-6 text-center text-xl text-purple-700 font-semibold transition-opacity duration-700 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {announcements[currentAnnouncement]}
          </div>
        ) : (
          <p className="text-gray-500">No announcements available right now.</p>
        )}
      </div>

      {/* Calendar */}
      <div className="mt-16">
        <h2 className="text-3xl text-gray-900 my-8 text-center">
          Your Calendar
        </h2>
        <Calendar />
      </div>

      {/* Stats */}
      <div className="mt-16">
        <h2 className="text-3xl text-gray-900 my-8 text-center"></h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                <span className="text-2xl  text-gray-900">
                  <AnimatedStat value={stat.value} />
                </span>
              </div>
              <h3 className="text-md font-medium text-gray-600">
                {stat.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* News */}
      {news.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl  text-gray-900 my-12 text-center ">
            Latest News📰
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-gray-600 text-sm mb-2">Date: {item.date}</p>
                <Link
                  to={item.link}
                  className="text-blue-500 text-sm hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movie links */}
      {movies.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl text-gray-900 text-center">
              Suggestions of the Week🎬
            </h2>
            <button
              onClick={() => setShowSuggestionModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Suggest</span>
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 w-full flex flex-col group"
              >
                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Movie Title over the image */}
                  <div className="absolute bottom-0 w-full px-4 py-2 z-10">
                    <h3 className="text-white text-2xl truncate">
                      {movie.title}
                    </h3>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="px-4 py-3 flex items-center justify-between bg-white border-b">
                  <div className="flex items-center space-x-2">
                    {movie.averageRating ? (
                      <>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(movie.averageRating!)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={
                                star <= Math.round(movie.averageRating!)
                                  ? "currentColor"
                                  : "none"
                              }
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {movie.averageRating.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No ratings yet
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setUserRating(0);
                        setShowRatingModal(true);
                      }}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      Rate
                    </button>
                    {movie.averageRating && (
                      <span className="text-sm text-gray-500">
                        ({movie.totalRatings}{" "}
                        {movie.totalRatings === 1 ? "rated" : "ratings"})
                      </span>
                    )}
                  </div>
                </div>

                {/* Link Section */}
                <div className="px-4 py-2 flex items-center bg-white">
                  <a
                    href={movie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium group-hover:animate-pulse"
                  >
                    Watch Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Rating Modal */}
          {showRatingModal && selectedMovie && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">
                  Rate "{selectedMovie.title}"
                </h3>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-3xl transition-colors"
                    >
                      <svg
                        className="w-10 h-10"
                        fill={
                          star <= (hoveredRating || userRating)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowRatingModal(false);
                      setSelectedMovie(null);
                      setUserRating(0);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRatingSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit Rating
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Suggest Your Watchings
            </h3>
            <p className="text-gray-600 mb-4">
              Suggest any documentaries or movies to admin for next week's
              suggestions
            </p>
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="Enter movie name and any additional details..."
              className="w-full p-3 border rounded-lg mb-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSuggestionModal(false);
                  setSuggestionText("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSuggestionSubmit}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hosted Websites */}
      {Websites.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl text-gray-900 my-12 text-center">
            Students sites 🌐
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Websites.map((website) => (
              <div
                key={website.title}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 w-full aspect-square flex flex-col"
              >
                {/* Image Section with Full Gradient Overlay */}
                <div className="relative w-full h-2/3">
                  <img
                    src={website.imgurl}
                    alt={website.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Full Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Text Content Over Gradient */}
                  <div className="absolute bottom-0 w-full px-4 py-3 z-10">
                    <h3 className="text-white text-md font-semibold">
                      {website.title}
                    </h3>
                    <p className="text-blue-200 text-xs">
                      {website.contributors.join(" | ")}
                    </p>
                  </div>
                </div>

                {/* Button Section */}
                <div className="px-4 py-2 flex items-center bg-white">
                  <a
                    href={website.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium group-hover:animate-pulse" // Pulse on hover
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Quick Links */}
      {blogs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Blog Posts
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ul className="space-y-3">
              {blogs.map((blog) => (
                <li key={blog.id} className="flex items-center justify-between">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-500 hover:underline flex-1"
                  >
                    {blog.title}
                  </Link>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {blog.category}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <Link
                to="/blogs"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                View All Blogs →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Quick Links */}
      {quizzes.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Quiz Links
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {quizzes.map((q) => (
              <li key={q.id}>
                <Link to={q.link} className="text-blue-500 hover:underline">
                  {q.name} ({q.code})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
