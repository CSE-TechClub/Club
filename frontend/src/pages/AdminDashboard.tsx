import React, { useState, useEffect } from "react";
import {
  Users,
  Brain,
  Shield,
  TrendingUp,
  UserPlus,
  Settings,
} from "lucide-react";

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function AdminDashboard() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [announcementInput, setAnnouncementInput] = useState("");

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizInput, setQuizInput] = useState({
    name: "",
    code: "",
    link: "",
    responseLink: "",
    description: "",
    difficulty: "Medium",
  });

  const [news, setNews] = useState<any[]>([]);
  const [newsInput, setNewsInput] = useState({
    title: "",
    link: "",
    date: "",
    image: "", // Add image input
    description: "", // Add description input
  });

  const stats: StatCard[] = [
    {
      title: "Total Members",
      value: 156,
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
      title: "Admin Count",
      value: 5,
      icon: Shield,
      color: "text-google-yellow",
    },
    {
      title: "Quiz Completions",
      value: 438,
      icon: TrendingUp,
      color: "text-google-green",
    },
  ];

  // Load announcements & quizzes & news from localStorage
  useEffect(() => {
    const storedAnnouncements = localStorage.getItem("announcements");
    const storedQuizzes = localStorage.getItem("quizzes");
    const storedNews = localStorage.getItem("news");
    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
    if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
    if (storedNews) setNews(JSON.parse(storedNews) || []); // Initialize to empty array if null
  }, []);

  const handleAnnouncementSubmit = () => {
    if (announcementInput.trim()) {
      const updated = [...announcements, announcementInput.trim()];
      setAnnouncements(updated);
      localStorage.setItem("announcements", JSON.stringify(updated));
      setAnnouncementInput("");
    }
  };

  const handleDeleteAnnouncement = (index: number) => {
    const updated = announcements.filter((_, i) => i !== index);
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  const handleQuizSubmit = () => {
    const { name, code, link, responseLink, description, difficulty } =
      quizInput;
    if (name && code && link && responseLink && description && difficulty) {
      const updated = [
        ...quizzes,
        { name, code, link, responseLink, description, difficulty },
      ];
      setQuizzes(updated);
      localStorage.setItem("quizzes", JSON.stringify(updated));
      setQuizInput({
        name: "",
        code: "",
        link: "",
        responseLink: "",
        description: "",
        difficulty: "Medium",
      });
    }
  };

  const handleDeleteQuiz = (index: number) => {
    const updated = quizzes.filter((_, i) => i !== index);
    setQuizzes(updated);
    localStorage.setItem("quizzes", JSON.stringify(updated));
  };

  const handleNewsInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewsInput({ ...newsInput, [name]: value });
  };

  const handleNewsSubmit = () => {
    const { title, link, date, image, description } = newsInput;
    if (title && link && date && image && description) {
      const updatedNews = [...news, { title, link, date, image, description }];
      setNews(updatedNews);
      localStorage.setItem("news", JSON.stringify(updatedNews));
      setNewsInput({
        title: "",
        link: "",
        date: "",
        image: "",
        description: "",
      });
    }
  };

  const handleDeleteNews = (index: number) => {
    const updatedNews = news.filter((_, i) => i !== index);
    setNews(updatedNews);
    localStorage.setItem("news", JSON.stringify(updatedNews));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full sm:w-auto">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add Admin</span>
          </button>
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

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
            {announcements.map((announcement, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                {announcement}
                <button
                  onClick={() => handleDeleteAnnouncement(index)}
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
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizInput.name}
            onChange={(e) =>
              setQuizInput({ ...quizInput, name: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Quiz Code"
            value={quizInput.code}
            onChange={(e) =>
              setQuizInput({ ...quizInput, code: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Google Form Link"
            value={quizInput.link}
            onChange={(e) =>
              setQuizInput({ ...quizInput, link: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />
          <textarea
            placeholder="Quiz Description"
            value={quizInput.description}
            onChange={(e) =>
              setQuizInput({ ...quizInput, description: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <select
            value={quizInput.difficulty}
            onChange={(e) =>
              setQuizInput({ ...quizInput, difficulty: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            type="text"
            placeholder="Google Form Response Link"
            value={quizInput.responseLink}
            onChange={(e) =>
              setQuizInput({ ...quizInput, responseLink: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleQuizSubmit} className="btn-primary">
            Submit
          </button>
          <ul className="mt-4">
            {quizzes.map((quiz, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {quiz.name} ({quiz.code})
                  </span>
                  <span className="italic text-sm text-gray-600">
                    Difficulty: {quiz.difficulty}
                  </span>
                  <a
                    href={quiz.responseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    📄 View Responses
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteQuiz(index)}
                  className="text-red-500 ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">News</h2>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={newsInput.title}
            onChange={handleNewsInputChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Link for website"
            name="link"
            value={newsInput.link}
            onChange={handleNewsInputChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="date"
            placeholder="Date"
            name="date"
            value={newsInput.date}
            onChange={handleNewsInputChange}
            className="w-full p-2 border rounded mb-2"
          />
          {/* Add input fields for image and description */}
          <input
            type="text"
            placeholder="Image URL"
            name="image"
            value={newsInput.image}
            onChange={handleNewsInputChange}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Description"
            name="description"
            value={newsInput.description}
            onChange={handleNewsInputChange}
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleNewsSubmit} className="btn-primary">
            Submit
          </button>
          <ul className="mt-4">
            {news.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <div>
                  <span className="font-medium">{item.title}</span>
                  <p className="text-gray-600 text-sm">Date: {item.date}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteNews(index)}
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
}

export default AdminDashboard;
