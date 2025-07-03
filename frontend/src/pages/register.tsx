import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface RegisterFormState {
  name: string;
  email: string;
  usn: string;
  password: string;
}

const USN_PATTERN = /^[1-9]KI\d{2}CS\d{3}$/;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    usn: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "usn") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, usn, password } = formData;

    // Validate USN pattern
    if (!USN_PATTERN.test(usn)) {
      setLoading(false);
      setError("USN must match the pattern 1KI22CS001 (all uppercase)");
      return;
    }

    // Check uniqueness of USN
    const { data: existingUser, error: usnError } = await supabase
      .from("users")
      .select("id")
      .eq("usn", usn)
      .single();
    if (existingUser) {
      setLoading(false);
      setError("USN already registered. Please login or use a different USN.");
      return;
    }

    // 1. Sign up the user via Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(`Registration failed: ${signUpError.message}`);
      return;
    }

    // 2. On success, insert additional profile data into your 'users' table
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        name,
        email,
        usn,
        role: "student",
      },
    ]);

    setLoading(false);

    if (dbError) {
      setError(`Database error: ${dbError.message}`);
      return;
    }

    alert("Registration successful! Please check your email to confirm.");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8 animate-slide-in">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["name", "email", "usn", "password"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-gray-700 font-semibold mb-1"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type={
                field === "email"
                  ? "email"
                  : field === "password"
                  ? "password"
                  : "text"
              }
              value={(formData as any)[field]}
              onChange={handleChange}
              required
              autoComplete={field === "usn" ? "off" : undefined}
              style={field === "usn" ? { textTransform: "uppercase" } : {}}
              className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                field === "password"
                  ? "focus:ring-google.red"
                  : "focus:ring-google.blue"
              }`}
            />
          </div>
        ))}
        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-300 disabled:opacity-50"
        >
          {loading ? "Registering…" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 font-medium hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
