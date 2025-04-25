import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Attempt sign-in
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password: passkey,
      });

    if (authError || !authData.user) {
      setLoading(false);
      return alert("Login failed: " + (authError?.message ?? "Unknown error"));
    }

    // 2. Verify role === "admin"
    const { data: userRecord, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    setLoading(false);

    if (roleError || !userRecord || userRecord.role !== "admin") {
      return alert("Access denied. You are not an admin.");
    }

    // 3. Redirect to admin dashboard
    navigate("/admin");
  };

  return (
    <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8 animate-slide-in">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Admin Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.blue"
          />
        </div>

        <div>
          <label
            htmlFor="passkey"
            className="block text-gray-700 font-semibold mb-1"
          >
            Passkey
          </label>
          <input
            id="passkey"
            name="passkey"
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-google.red"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Login as Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
