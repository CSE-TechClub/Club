import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Exchange the code for tokens
        const response = await fetch("/api/auth/google/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange code for tokens");
        }

        const { access_token, refresh_token } = await response.json();

        // Store the tokens in Supabase
        await supabase.from("user_google_tokens").upsert({
          user_id: user.id,
          google_access_token: access_token,
          google_refresh_token: refresh_token,
          updated_at: new Date().toISOString(),
        });

        // Redirect back to the calendar page
        navigate("/");
      } catch (err) {
        console.error("Error handling Google auth callback:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-18 bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Connecting to Google Calendar...
      </h2>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
