import React, { useState, useEffect } from 'react';
import { Search, Clock, Award, Brain } from 'lucide-react';

interface Quiz {
  name: string;
  code: string;
  link: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function Quizzes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("quizzes");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setQuizzes(parsed);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      }
    }
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: Quiz['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'text-google-green';
      case 'Medium': return 'text-google-yellow';
      case 'Hard': return 'text-google-red';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <p className="text-gray-500 text-lg">No quizzes found or added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-google-blue" />
                  <span className={`font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.name}</h3>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="font-medium">Access Code:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {quiz.code}
                  </span>
                </div>
                <div className="mt-4">
                  <a
                    href={quiz.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Take Quiz
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quizzes;
