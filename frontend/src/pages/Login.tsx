import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface LoginFormState {
  USN: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    USN: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "USN") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { USN, password } = formData;
    const usnUpper = USN.toUpperCase();

    // 1. Fetch email & role by USN
    const { data: userRecord, error: lookupError } = await supabase
      .from("users")
      .select("email, role")
      .eq("usn", usnUpper)
      .single();

    if (lookupError || !userRecord) {
      setLoading(false);
      return alert("USN not found. Please check your USN or register first.");
    }

    // 2. Sign in with Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: userRecord.email,
      password,
    });

    setLoading(false);

    if (authError) {
      return alert("Login failed: " + authError.message);
    }

    // 3. Redirect based on role
    if (userRecord.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8 animate-slide-in">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="USN"
            className="block text-gray-700 font-semibold mb-1"
          >
            USN
          </label>
          <input
            id="USN"
            name="USN"
            type="text"
            value={formData.USN}
            onChange={handleChange}
            required
            autoComplete="off"
            style={{ textTransform: "uppercase" }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.blue"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.red"
          />
        </div>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>

        <p className="mt-2 text-center text-sm">
          Are you an admin?{" "}
          <Link
            to="/adminlogin"
            className="text-indigo-600 font-medium hover:underline"
          >
            Admin Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
