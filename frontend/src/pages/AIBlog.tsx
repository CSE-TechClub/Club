import React from 'react';

const AIBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">AI Avengers 🧠</h1>
      <img
        src="https://images.unsplash.com/photo-1581093588401-8155d4a4885d"
        alt="AI Banner"
        className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
      />
      <p className="text-lg text-gray-700 mb-6">
        AI Avengers is your gateway into the world of Artificial Intelligence and Machine Learning. From beginner-friendly concepts to deep neural networks, this club guides students through real-world applications of AI and data science.
      </p>
      <h2 className="text-2xl font-semibold mb-4">🗺️ Roadmap</h2>
      <img
        src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AwYSkGFGwGqYwrpT6vZ0MQ.png"
        alt="AI Roadmap"
        className="w-full rounded-md shadow-md"
      />
    </div>
  );
};

export default AIBlog;
