import React from 'react';

const WebDevBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Web Wizards 🌐</h1>
      <img
        src="https://images.unsplash.com/photo-1559028012-481c04fa7023"
        alt="Web Dev Banner"
        className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
      />
      <p className="text-lg text-gray-700 mb-6">
        Web Wizards empowers students to build beautiful, scalable websites and web apps using modern tools like HTML, CSS, JavaScript, React, and backend frameworks. Whether you're just starting out or aiming to master full-stack, we've got you covered.
      </p>
      <h2 className="text-2xl font-semibold mb-4">🗺️ Roadmap</h2>
      <img
        src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*7pxEFK7UuU_ZU4p4du8r8Q.png"
        alt="Web Dev Roadmap"
        className="w-full rounded-md shadow-md"
      />
    </div>
  );
};

export default WebDevBlog;
