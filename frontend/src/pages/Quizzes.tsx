import React, { useState } from 'react';
import { Search, Clock, Award, Plus, Brain } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  accessCode: string;
  questions: number;
}

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Web Development Basics',
    description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals',
    timeLimit: 30,
    difficulty: 'Easy',
    accessCode: 'WEB101',
    questions: 15
  },
  {
    id: '2',
    title: 'Advanced React Concepts',
    description: 'Deep dive into React hooks, context, and performance optimization',
    timeLimit: 45,
    difficulty: 'Hard',
    accessCode: 'REACT201',
    questions: 20
  }
];

function Quizzes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.accessCode.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Quiz</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 text-google-blue" />
                <span className={`font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.timeLimit} mins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>{quiz.questions} questions</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Access Code:</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {quiz.accessCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quizzes;