import React from 'react';
import banner from '../assets/banner.jpg'; // ✅ adjust if needed based on file location

const DevOpsBlog = () => {
  const roadmap = [
    {
      title: "1. Version Control & Git Basics",
      points: [
        "Learn how to track changes in code using Git and collaborate on platforms like GitHub.",
        <a key="1a" href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Git Docs</a>
      ]
    },
    {
      title: "2. CI/CD Basics",
      points: [
        "Understand how Continuous Integration and Deployment help automate building, testing, and deployment.",
        <a key="2a" href="https://docs.github.com/en/actions" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub Actions</a>
      ]
    },
    {
      title: "3. Docker & Containerization",
      points: [
        "Package applications and dependencies into lightweight containers for consistent environments.",
        <a key="3a" href="https://www.docker.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Docker Official Site</a>
      ]
    },
    {
      title: "4. Kubernetes & Orchestration",
      points: [
        "Manage, scale, and deploy containerized applications using Kubernetes clusters.",
        <a key="4a" href="https://kubernetes.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Kubernetes Docs</a>
      ]
    },
    {
      title: "5. Infrastructure as Code (IaC)",
      points: [
        "Use code to provision and manage infrastructure consistently and automatically.",
        <a key="5a" href="https://www.terraform.io/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Terraform Docs</a>
      ]
    },
    {
      title: "6. Monitoring & Logging",
      points: [
        "Track system health and logs using tools like Prometheus, Grafana, and ELK stack.",
        <a key="6a" href="https://grafana.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Grafana Site</a>
      ]
    },
    {
      title: "7. Security in DevOps",
      points: [
        "Implement secure DevOps practices like scanning vulnerabilities and managing secrets.",
        <a key="7a" href="https://snyk.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Snyk</a>
      ]
    },
    {
      title: "8. Scaling & Performance",
      points: [
        "Use load balancers and auto-scaling to ensure performance under heavy usage."
      ]
    },
    {
      title: "9. Configuration Management",
      points: [
        "Automate software and OS configurations with tools like Ansible or Chef.",
        <a key="9a" href="https://www.ansible.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ansible</a>
      ]
    },
    {
      title: "10. Cloud Platforms",
      points: [
        "Deploy and manage infrastructure using cloud providers like AWS, Azure, or GCP.",
        <a key="10a" href="https://aws.amazon.com/what-is-devops/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">AWS DevOps Guide</a>
      ]
    },
    {
      title: "11. Soft Skills & Best Practices",
      points: [
        "Work in teams, document processes, and maintain clear communication for smoother DevOps culture."
      ]
    },
    {
      title: "12. Final Project",
      points: [
        "Build and deploy a real-world application with a complete DevOps pipeline including CI/CD, containerization, and monitoring."
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">Dev Dynamos ⚙️</h1>

      {/* ✅ Banner Image */}
      <img
        src={banner}
        alt="DevOps Banner"
        className="w-full aspect-[2/1] object-cover rounded-lg shadow-lg mb-6"
      />


      {/* Intro */}
      <p className="text-lg text-gray-700 mb-8">
        Dev Dynamos focuses on software development practices, version control, CI/CD pipelines, Docker, Kubernetes, and more. Learn how real-world engineering teams build and ship products with efficiency.
      </p>

      {/* Roadmap */}
      <h2 className="text-2xl font-semibold mb-4">🗺️ Roadmap</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmap.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow border">
            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {item.points.map((point, idx) =>
                typeof point === "string" ? (
                  <li key={idx}>{point}</li>
                ) : (
                  <li key={idx}>{point}</li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevOpsBlog;
