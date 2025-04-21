import React from "react";
import banner from "../assets/WebBanner.png";

const Topics = [
  {
    name: "1. HTML & CSS Basics",
    TechStack: "HTML5, CSS3, Flexbox, Grid",
    Project: "Build a personal portfolio page",
  },
  {
    name: "2. JavaScript Fundamentals",
    TechStack: "ES6+, DOM",
    Project: "Create a To-do list app",
  },
  {
    name: "3.DOM Projects & API Intro",
    TechStack: "JS DOM Manipulation, Fetch API",
    Project: "Build a dynamic photo gallery pulling images from an API",
  },
  {
    name: "4. React Basics",
    TechStack: "React, JSX, Components, State",
    Project: "Build a weather app using OpenWeatherMap API",
  },
  {
    name: "5. React Router & Advanced State",
    TechStack: "React Router, useState, useEffect",
    Project: "Create a blog UI with multiple pages",
  },
  {
    name: "6. Backend with Node.js & Express",
    TechStack: "Node.js, Express.js, REST API basics",
    Project: "Build a simple Notes API with CRUD operations",
  },
  {
    name: "7. Databases with MongoDB",
    TechStack: "MongoDB, Mongoose, MongoDB Atlas",
    Project: "Add DB to Notes API: save/retrieve notes from MongoDB",
  },
  {
    name: "8. User Authentication",
    TechStack: "JWT, bcrypt, Express middleware",
    Project: "Build a User Login System with auth & protected routes",
  },
  {
    name: "9. Full Stack Integration",
    TechStack: "React (frontend) + Express & MongoDB (backend)",
    Project: "Connect frontend to backend: full CRUD web app",
  },
  {
    name: "10. Deployment & DevOps",
    TechStack: "GitHub, Netlify/Vercel, Render, .env",
    Project: "Deploy full stack app, set up environment variables",
  },
  {
    name: "11. Final Project Planning",
    TechStack: "Wireframing, Feature Planning, Git branching",
    Project: "Submit project idea, create repo, build wireframes",
  },
  {
    name: "12. Final Project Demo",
    TechStack: "Full stack, deployed, responsive",
    Project: "Present final project, peer feedback, Q&A",
  },
];

const Resources = [
  {
    link: "https://www.youtube.com/embed/tVzUXW6siu0?si=nfc-rRdt8mp17pJ5",
    title: "Code With Harry",
    discription:
      "Learn web dev with CodeWithHarry using HTML, CSS, JS, React & Node.js.Beginner-friendly, project-based tutorials in Hindi.",
  },
  {
    link: "https://www.youtube.com/embed/_7UQPve99r4?si=OKQ0eqfQVns8t5J5",
    title: "Free Code Camp",
    discription:
      "Build a backend server with Node.js & Express, and connect it to MongoDB Perform full CRUD operations with clean, beginner-friendly code.",
  },
  {
    link: "https://www.youtube.com/embed/kUMe1FH4CHE?si=qlJS3ZcZnGyJrAD2",
    title: "Free Code Camp",
    discription:
      "Learn HTML from scratch and build the foundation of every website.Perfect for beginners with clear explanations and hands-on examples.",
  },
  {
    link: "https://www.youtube.com/embed/OXGznpKZ_sA?si=3qwK7q9Stl3u6tfj",
    title: "Free Code Camp",
    discription:
      "Master CSS from scratch and create stunning, responsive websites with clear explanations and practical examples, perfect for beginners.",
  },
  {
    link: "https://www.youtube.com/embed/ajdRvxDWH4w?si=09uc9NOzy_hmS539",
    title: "Apna College",
    discription:
      "Learn JavaScript from scratch and unlock the power of dynamic web development with easy-to-follow tutorials and hands-on examples, perfect for beginners.",
  },
];
const WebDevBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Web Wizards 🌐</h1>
      <img
        src={banner}
        alt="Web Dev Banner"
        className="w-full rounded-lg shadow-lg mb-6 overflow-hidden"
        style={{ aspectRatio: "auto" }}
      />
      <p className="text-lg text-gray-700 mb-6">
        Web Wizards empowers students to build beautiful, scalable websites and
        web apps using modern tools like HTML, CSS, JavaScript, React, and
        backend frameworks. Whether you're just starting out or aiming to master
        full-stack, we've got you covered.
      </p>
      <h2 className="text-2xl font-semibold text-center mb-4">🗺️ Roadmap</h2>
      {/*Course Objectives and Outcomes */}
      <div className={`max-w-5xl bg-white rounded-lg px-8 py-6 text-xl`}>
        <h3 className="text-xl font-semibold mb-2">
          Course Objectives, Projects and Outcomes
        </h3>
        <p className="text-gray-600">
          Understand the structure of modern web applications (frontend,
          backend, and databases).
        </p>
        <p className="text-gray-600">
          Build responsive, user-friendly websites using HTML, CSS, and
          JavaScript.
        </p>
        <p className="text-gray-600">
          Develop dynamic single-page applications using modern frontend
          frameworks (e.g., React).
        </p>
        <p className="text-gray-600">
          Create and interact with RESTful APIs using Node.js and Express.
        </p>
        <p className="text-gray-600">
          Manage databases with MongoDB and connect them to web applications.
        </p>
        <p className="text-gray-600">
          Understand deployment, version control, and basic security practices.
        </p>
      </div>
      {/* Course Content and Topics */}
      {/* Timeline(12week) and Projects */}
      <h2 className="text-2xl font-semibold mt-4 mb-4">
        Topics, Content and Timeline(12week)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
        {Topics.map((topic) => (
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
            <p className="text-blue-600">{topic.TechStack}</p>
            <p className="text-gra-600">{topic.Project}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mt-4 mb-4">References</h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
        {Resources.map((links) => (
          <div className="card hover:shadow-lg transition-shadow p-4 rounded bg-white">
            <div className="aspect-w-16 aspect-h-10 mb-4">
              <iframe
                src={links.link}
                title={links.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <p className="text-gray-600">{links.discription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebDevBlog;
