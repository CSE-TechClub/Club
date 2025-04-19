import React from 'react';
import { Github, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
            © 2024 Students Club. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://github.com/CSE-TechClub" 
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="mailto:csekitclub@gmail.com" 
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;