import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface UserProfile {
  name: string;
  email: string;
  usn: string;
  role: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) return;

      const { data, error } = await supabase
        .from("users")
        .select("name, email, usn, role")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setUserProfile(data);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!userProfile)
    return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile</h2>
      <div className="space-y-4 text-gray-700 text-lg">
        <div><strong>Name:</strong> {userProfile.name}</div>
        <div><strong>Email:</strong> {userProfile.email}</div>
        <div><strong>USN:</strong> {userProfile.usn}</div>
        <div><strong>Role:</strong> {userProfile.role}</div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
