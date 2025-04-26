import React from "react";
import { Github, Loader2 } from "lucide-react";
import { fetchLeaderboardData, GitHubContributor } from "../services/github";

export function LeaderboardPage() {
  const [contributors, setContributors] = React.useState<GitHubContributor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLeaderboardData();
        setContributors(data);
      } catch (err) {
        setError("Failed to load contributor data. Please try again later.");
        console.error("Error loading contributors:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contributor Leaderboard
        </h1>
        <p className="text-xl text-gray-600">
          Celebrating the awesome people behind our work!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-100 rounded-xl border border-red-300">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contributor</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 hidden md:table-cell">PRs</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 hidden md:table-cell">Issues</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 hidden md:table-cell">Commits</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contributors.map((contributor, index) => (
                  <tr key={contributor.github} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-600"
                            : index === 1
                            ? "bg-gray-200 text-gray-600"
                            : index === 2
                            ? "bg-orange-100 text-orange-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img
                          src={contributor.profileImage}
                          alt={contributor.name}
                          className="h-10 w-10 rounded-full border border-gray-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              contributor.name || contributor.github
                            )}&background=random`;
                          }}
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {contributor.name || contributor.github}
                          </div>
                          <div className="text-sm text-gray-500">@{contributor.github}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-800 font-medium hidden md:table-cell">
                      {contributor.prs}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-800 font-medium hidden md:table-cell">
                      {contributor.issues}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-800 font-medium hidden md:table-cell">
                      {contributor.commits}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <a
                        href={contributor.githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:text-purple-900 transition"
                      >
                        <Github className="h-5 w-5 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Want to contribute? Check out our{" "}
            <a
                href="https://github.com/CSE-TechClub/Club" target="_blank" rel="noopener noreferrer">
                <span className="text-blue-600 hover:text-blue-800 underline">GitHub repository</span>
                </a>
            </p>
        </div>
    </div>
  );
}
