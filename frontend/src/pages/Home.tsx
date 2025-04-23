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

  // Load announcements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("announcements");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAnnouncements(parsed);
        }
      } catch (err) {
        console.error("Failed to parse announcements:", err);
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

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements📌</h2>

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
    </div>
  );
}

export default Home;
