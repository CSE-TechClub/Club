import React, { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterFormState {
  name: string;
  email: string;
  usn: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    usn: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // handle register logic here
  };

  return (
    <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8 animate-slide-in">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.blue"
          />
        </div>
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
          <label htmlFor="usn" className="block text-gray-700 font-semibold mb-1">
            USN
          </label>
          <input
            name="usn"
            value={formData.usn}
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
          Register
        </button>
    </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/Login" className="text-indigo-600 font-medium hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
