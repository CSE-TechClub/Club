import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const GoogleCalendarAuth: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_google_tokens")
        .select("google_access_token")
        .eq("user_id", user.id)
        .single();

      setIsConnected(!!data?.google_access_token);
    } catch (error) {
      console.error("Error checking connection status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = "https://www.googleapis.com/auth/calendar.events";

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("user_google_tokens").delete().eq("user_id", user.id);

      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Disconnect Google Calendar
        </button>
      ) : (
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Connect Google Calendar
        </button>
      )}
    </div>
  );
};

export default GoogleCalendarAuth;
