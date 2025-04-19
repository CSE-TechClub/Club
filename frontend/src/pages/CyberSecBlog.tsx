import React from 'react';

const CyberSecBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Cyber Scholars 🔐</h1>
      <img
        src="https://images.unsplash.com/photo-1605902711622-cfb43c4437d4"
        alt="Cybersecurity Banner"
        className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
      />
      <p className="text-lg text-gray-700 mb-6">
        Cyber Scholars equips you with the knowledge to defend networks and systems from threats. From ethical hacking to secure coding, you'll learn how to protect data and digital infrastructure.
      </p>
      <h2 className="text-2xl font-semibold mb-4">🗺️ Roadmap</h2>
      <img
        src="https://i.imgur.com/WHv50T9.jpg"
        alt="Cybersecurity Roadmap"
        className="w-full rounded-md shadow-md"
      />
    </div>
  );
};

export default CyberSecBlog;
