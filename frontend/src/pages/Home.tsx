import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Brain, Cpu, Shield } from "lucide-react";
import { supabase } from "../supabaseClient";

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

const Websites = [
  {
    title: "Discuza Forum",
    imgurl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgZoD-qhoyKJOMX9-7qr3L2OGEl0VsXTvJ7A&s",
    contributors: ["Gagan T P", "Abhilash T K", "Harshitha A M", "Bindu A C"],
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

  // Announcement carousel state
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);

  // News & Quizzes
  const [news, setNews] = useState<NewsItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Fetch announcements + subscribe to realtime
  useEffect(() => {
    const fetchData = async () => {
      // Auth guard
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
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

      {/* News */}
      {news.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
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

      {/* Hosted Websites */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Hosted websites
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <p className="text-white text-xs">{website.descritption}</p>
                  <p className="text-blue-200 text-xs">
                    {website.contributors.join(" | ")}
                  </p>
                </div>
              </div>

              {/* Button Section */}
              <div className="flex-1 flex items-center justify-center px-4 py-3">
                <a
                  href={website.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
                >
                  Click to View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

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
