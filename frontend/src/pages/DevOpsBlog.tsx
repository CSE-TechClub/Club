import React from 'react';

const DevOpsBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">Dev Dynamos ⚙️</h1>
      <img
        src="https://images.unsplash.com/photo-1555949963-aa79dcee981d"
        alt="DevOps Banner"
        className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
      />
      <p className="text-lg text-gray-700 mb-6">
        Dev Dynamos focuses on software development practices, version control, CI/CD pipelines, Docker, Kubernetes, and more. Learn how real-world engineering teams build and ship products with efficiency.
      </p>
      <h2 className="text-2xl font-semibold mb-4">🗺️ Roadmap</h2>
      <img
        src="https://i.imgur.com/N95P0eO.png"
        alt="DevOps Roadmap"
        className="w-full rounded-md shadow-md"
      />
    </div>
  );
};

export default DevOpsBlog;
