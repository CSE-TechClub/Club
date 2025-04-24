import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Code2, Brain, Cpu, Shield } from "lucide-react";

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

function Home() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    // Load announcements from localStorage
    const storedAnnouncements = localStorage.getItem("announcements");
    if (storedAnnouncements) {
      try {
        const parsed = JSON.parse(storedAnnouncements);
        if (Array.isArray(parsed)) {
          setAnnouncements(parsed);
        }
      } catch (err) {
        console.error("Failed to parse announcements:", err);
      }
    }

    // Load news from localStorage
    const storedNews = localStorage.getItem("news");
    if (storedNews) {
      try {
        const parsedNews = JSON.parse(storedNews);
        if (Array.isArray(parsedNews)) {
          setNews(parsedNews);
        }
      } catch (err) {
        console.error("Failed to parse news:", err);
      }
    }
  }, []);

  // Handle announcement cycling with fade
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!paused && announcements.length > 0) {
      interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
          setFade(true);
        }, 300);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [paused, currentAnnouncement, announcements]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Students Club
        </h1>
        <p className="text-xl text-gray-600">
          Join our community of passionate learners and innovators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {subclubs.map((club) => (
          <Link to={club.link} key={club.name} className="group">
            <div className="card hover:shadow-lg transition-shadow">
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
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Latest News📰
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
                {item.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {item.description}
                  </p>
                )}
                <p className="text-gray-600 text-sm mb-2">Date: {item.date}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
