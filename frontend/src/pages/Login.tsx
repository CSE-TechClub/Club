import React, { useState } from "react";

interface LoginFormState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
  };

  return (
    <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8 animate-slide-in">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.blue"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.red"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-300">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
