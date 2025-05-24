import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Star, UserCircle2 } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  usn: string;
  role: string;
  reputation?: number;
  created_at?: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!user || authError) {
          setError("Please login to view your profile");
          return;
        }

        // First try to get all fields
        const { data, error } = await supabase
          .from("users")
          .select("name, email, usn, role, reputation, created_at")
          .eq("id", user.id)
          .single();

        if (error) {
          // If error, try without the new columns
          const { data: basicData, error: basicError } = await supabase
            .from("users")
            .select("name, email, usn, role")
            .eq("id", user.id)
            .single();

          if (basicError) {
            throw basicError;
          }

          // Set profile with default values for new columns
          setUserProfile({
            ...basicData,
            reputation: 0,
            created_at: new Date().toISOString()
          });
        } else {
          setUserProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
        <div className="text-center text-gray-500">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <UserCircle2 className="h-16 w-16 text-gray-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.usn}</p>
          <p className="text-sm text-gray-500 capitalize">{userProfile.role}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-semibold text-gray-900">
            Reputation: {userProfile.reputation || 0}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Member since {new Date(userProfile.created_at || new Date()).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-4 text-gray-700 text-lg mb-6">
        <div><strong>Email:</strong> {userProfile.email}</div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Likes Received</span>
            <span className="font-medium text-gray-900">{userProfile.reputation || 0}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
