import React from "react";
import banner from "../assets/AIBanner.png"; // Replace with your actual banner image

const Topics = [
  {
    name: "1. Python for AI",
    TechStack: "Python, Numpy, Pandas, Matplotlib",
    Project: "Build a basic calculator, data visualizer, or weather app using API",
  },
  {
    name: "2. Introduction to Machine Learning",
    TechStack: "Scikit-learn, Jupyter Notebook",
    Project: "Train a model to classify emails as spam or not",
  },
  {
    name: "3. Deep Learning Foundations",
    TechStack: "Neural Networks, TensorFlow/Keras",
    Project: "Digit recognition using MNIST dataset",
  },
  {
    name: "4. Computer Vision",
    TechStack: "OpenCV, CNNs",
    Project: "Create a face detection or object classification app",
  },
  {
    name: "5. Natural Language Processing",
    TechStack: "NLTK, HuggingFace Transformers",
    Project: "Build a sentiment analysis or chatbot system",
  },
  {
    name: "6. Generative AI",
    TechStack: "DALL·E, GPT, Stable Diffusion",
    Project: "Generate images or text using prompts",
  },
  {
    name: "7. AI Ethics & Applications",
    TechStack: "Case Studies, OpenAI Safety Guidelines",
    Project: "Present ethical concerns & solutions for an AI application",
  },
];

const Resources = [
  {
    link: "https://www.youtube.com/embed/aircAruvnKk",
    title: "3Blue1Brown",
    discription: "Visual Introduction to Neural Networks – Great for beginners!",
  },
  {
    link: "https://www.youtube.com/embed/tPYj3fFJGjk",
    title: "Codebasics",
    discription:
      "Machine Learning A-Z project-based tutorials with Python and Scikit-learn.",
  },
  {
    link: "https://www.youtube.com/embed/xvqsFTUsOmc",
    title: "Simplilearn",
    discription: "Intro to Deep Learning using TensorFlow/Keras - Hands-on explanation.",
  },
  {
    link: "https://www.youtube.com/embed/yMk_XtIEzH8",
    title: "Krish Naik",
    discription:
      "Complete guide to NLP using real-life examples and Python code.",
  },
];

const AIBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">AI Avengers 🧠</h1>
      <img
        src={banner}
        alt="AI Banner"
        className="w-full rounded-lg shadow-lg mb-6"
      />
      <p className="text-lg text-gray-700 mb-6">
        AI Avengers is your gateway into the world of Artificial Intelligence. Learn Python, explore Machine Learning, Deep Learning, NLP, and even dive into Generative AI. This roadmap is designed to give you the practical skills and knowledge to innovate with AI.
      </p>

      <h2 className="text-2xl font-semibold text-center mb-4">🗺️ Roadmap</h2>

      <div className="max-w-5xl bg-white rounded-lg px-8 py-6 text-xl">
        <h3 className="text-xl font-semibold mb-2">Course Objectives & Outcomes</h3>
        <p className="text-gray-600">Understand AI concepts like supervised/unsupervised learning, neural networks, and NLP.</p>
        <p className="text-gray-600">Build practical projects using real-world datasets and tools like Python, TensorFlow, and OpenCV.</p>
        <p className="text-gray-600">Develop an understanding of ethical AI, model bias, and responsible deployment.</p>
        <p className="text-gray-600">Explore advanced topics like Generative AI and create interactive AI applications.</p>
      </div>

      <h2 className="text-2xl font-semibold mt-4 mb-4">Topics, Content & Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Topics.map((topic, idx) => (
          <div key={idx} className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
            <p className="text-red-600">{topic.TechStack}</p>
            <p className="text-gray-600">{topic.Project}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-4 mb-4">References</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Resources.map((links, idx) => (
          <div key={idx} className="card hover:shadow-lg transition-shadow p-4 rounded bg-white">
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

export default AIBlog;
