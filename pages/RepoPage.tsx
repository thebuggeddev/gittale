import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCommits,
  fetchRepoDetails,
  fetchContributors,
  fetchLanguages,
} from "../services/githubService";
import { transformCommitToStory } from "../utils/storyGenerator";
import {
  StoryEvent,
  RepoInfo,
  StoryType,
  Contributor,
  Languages,
} from "../types";
import { NeoButton, NeoCard } from "../components/NeoComponents";
import { Timeline } from "../components/Timeline";
import { StatsBoard } from "../components/StatsBoard";
import { RepoAnalytics } from "../components/RepoAnalytics";
import { TicketModal } from "../components/TicketModal";
import { RepoPassportModal } from "../components/RepoPassportModal";
import { Achievements } from "../components/Achievements";
import {
  AlertTriangle,
  Github,
  Star,
  Code2,
  FileBadge,
  Filter,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
} from "lucide-react";

export const RepoPage: React.FC = () => {
  const { owner, repoName } = useParams();
  const navigate = useNavigate();
  const repoIdentifier = `${owner}/${repoName}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [languages, setLanguages] = useState<Languages>({});

  // UI State
  const [filterType, setFilterType] = useState<StoryType | "ALL">("ALL");
  const [selectedTicket, setSelectedTicket] = useState<StoryEvent | null>(null);
  const [showPassport, setShowPassport] = useState(false);
  const [copied, setCopied] = useState(false);

  // Share Menu State
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (!owner || !repoName) return;
    fetchData();
  }, [owner, repoName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".share-container")) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setEvents([]);
    setRepoInfo(null);
    setContributors([]);
    setLanguages({});
    setFilterType("ALL");

    try {
      // 1. Fetch Repository Details
      const repoRes = await fetchRepoDetails(repoIdentifier);
      if (repoRes.error) {
        if (repoRes.error === "RATE_LIMIT_EXCEEDED")
          throw new Error("RATE_LIMIT_EXCEEDED");
        throw new Error(repoRes.error);
      }
      setRepoInfo(repoRes.data);

      // 2. Fetch Commits
      const commitsRes = await fetchCommits(repoIdentifier);
      if (commitsRes.error) {
        if (commitsRes.error === "RATE_LIMIT_EXCEEDED")
          throw new Error("RATE_LIMIT_EXCEEDED");
        throw new Error(commitsRes.error);
      }

      // 3. Fetch Contributors
      const contribRes = await fetchContributors(repoIdentifier);
      if (!contribRes.error && contribRes.data) {
        setContributors(contribRes.data);
      }

      // 4. Fetch Languages
      const langRes = await fetchLanguages(repoIdentifier);
      if (!langRes.error && langRes.data) {
        setLanguages(langRes.data);
      }

      // 5. Transform to Stories
      if (commitsRes.data) {
        const stories = commitsRes.data.map(transformCommitToStory);
        setEvents(stories);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
    const url = window.location.href;
    const text = `Check out the commit story of ${repoIdentifier} on GitTale! 🚀`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredEvents =
    filterType === "ALL" ? events : events.filter((e) => e.type === filterType);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8 opacity-50 pointer-events-none animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-8">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-700"></div>
            <div className="flex-1 h-32 bg-gray-100 dark:bg-neutral-800 rounded-xl border-2 border-gray-200 dark:border-neutral-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mb-8 animate-bounce-in">
        <NeoCard
          bgColor="bg-red-100 dark:bg-red-900"
          className="flex items-center gap-4 p-6"
        >
          <div className="bg-red-500 text-white p-3 rounded-full border-2 border-black">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-red-900 dark:text-red-100">
              {error === "RATE_LIMIT_EXCEEDED" ? "Rate Limit Hit" : "Oops!"}
            </h3>
            <p className="text-red-800 dark:text-red-200 font-medium leading-relaxed">
              {error === "RATE_LIMIT_EXCEEDED"
                ? "You have used up the 60 requests/hour limit for public IP addresses."
                : error}
            </p>
            {error === "RATE_LIMIT_EXCEEDED" && (
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-token-modal"))
                }
                className="mt-2 text-sm font-black underline text-red-900 dark:text-white hover:text-red-700 decoration-2 underline-offset-2"
              >
                Add API Key to increase limit &rarr;
              </button>
            )}
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-black underline text-red-900 dark:text-white hover:text-red-700 decoration-2 underline-offset-2"
              >
                Return Home &rarr;
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-black underline text-red-900 dark:text-white hover:text-red-700 decoration-2 underline-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Modal for Ticket Generation */}
      {selectedTicket && (
        <TicketModal
          event={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Modal for Repo Passport */}
      {showPassport && repoInfo && (
        <RepoPassportModal
          repoInfo={repoInfo}
          languages={languages}
          onClose={() => setShowPassport(false)}
        />
      )}

      {/* Repo Header Info */}
      {repoInfo && (
        <div className="mb-12">
          {/* Action Row: Generate Link & Share Button */}
          <div className="flex justify-between items-end mb-4 px-1">
            {/* Generate Yours Link */}
            <button
              onClick={() => navigate("/")}
              className="text-sm font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors mb-2"
            >
              Generate yours as well &rarr;
            </button>

            {/* Share Button with Click Dropdown */}
            <div className="relative z-30 share-container">
              <NeoButton
                variant="secondary"
                className="px-5 py-2 text-sm font-bold flex items-center gap-2 h-10"
                onClick={() => setIsShareOpen(!isShareOpen)}
              >
                <Share2 size={16} />
                <span>Share</span>
              </NeoButton>

              {isShareOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 z-50 pt-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-gray-500 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        handleShare("twitter");
                        setIsShareOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg transition-colors font-bold text-sm text-black dark:text-white"
                    >
                      <Twitter size={16} /> X / Twitter
                    </button>
                    <button
                      onClick={() => {
                        handleShare("linkedin");
                        setIsShareOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white rounded-lg transition-colors font-bold text-sm text-black dark:text-white"
                    >
                      <Linkedin size={16} /> LinkedIn
                    </button>
                    <button
                      onClick={() => {
                        handleShare("copy");
                        setIsShareOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors font-bold text-sm text-black dark:text-white"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <LinkIcon size={16} />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <NeoCard className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
            {/* Decorative background element constrained to rounded corners */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 dark:bg-yellow-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            </div>

            <img
              src={repoInfo.owner.avatar_url}
              alt={repoInfo.full_name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-black dark:border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] relative z-10"
            />

            <div className="flex-1 text-center md:text-left z-10 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-2">
                <h2 className="text-3xl font-black text-black dark:text-white break-all">
                  {repoInfo.full_name}
                </h2>
              </div>

              <p className="text-gray-600 dark:text-gray-300 font-medium text-lg leading-relaxed mb-4 max-w-2xl">
                {repoInfo.description || "No description provided."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-neutral-800 border-2 border-black dark:border-gray-500 rounded-lg text-sm font-bold text-black dark:text-white">
                  <Star size={16} className="text-orange-500 fill-orange-500" />
                  {repoInfo.stargazers_count.toLocaleString()}
                </div>
                {repoInfo.language && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 border-2 border-black dark:border-blue-400 rounded-lg text-sm font-bold text-black dark:text-blue-100">
                    <Code2
                      size={16}
                      className="text-blue-600 dark:text-blue-300"
                    />
                    {repoInfo.language}
                  </div>
                )}
                <a
                  href={`https://github.com/${repoInfo.full_name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black border-2 border-black rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </div>
            </div>

            {/* Passport Button Positioned Absolute Top Right on Desktop */}
            <div className="absolute top-4 right-4 md:static md:ml-auto hidden md:block z-10">
              <NeoButton
                onClick={() => setShowPassport(true)}
                variant="primary"
                className="py-2 px-4 text-xs md:text-sm bg-blue-500 hover:bg-blue-400 text-white border-blue-900"
              >
                <FileBadge size={18} />
                <span>Generate Passport</span>
              </NeoButton>
            </div>
            {/* Mobile Passport Button */}
            <div className="md:hidden w-full z-10 relative">
              <NeoButton
                onClick={() => setShowPassport(true)}
                variant="primary"
                className="w-full py-2 px-4 text-sm bg-blue-500 hover:bg-blue-400 text-white border-blue-900"
              >
                <FileBadge size={18} />
                <span>Generate Passport</span>
              </NeoButton>
            </div>
          </NeoCard>
        </div>
      )}

      {/* Analytics Dashboard */}
      {repoInfo &&
        (contributors.length > 0 || Object.keys(languages).length > 0) && (
          <RepoAnalytics
            contributors={contributors}
            languages={languages}
            repoInfo={repoInfo}
            events={events}
          />
        )}

      {/* Stats & Timeline */}
      {events.length > 0 && repoInfo && (
        <div className="animate-slide-up">
          <StatsBoard events={events} repoInfo={repoInfo} />
          <Achievements
            repoInfo={repoInfo}
            events={events}
            contributorCount={contributors.length}
          />

          {/* Timeline Controls */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">
                Recent Quests
              </h3>
              <div className="bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded text-xs font-bold">
                {filteredEvents.length} items
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                className="bg-transparent font-bold text-sm focus:outline-none dark:text-white cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="ALL">All Events</option>
                <option value={StoryType.FEATURE}>Features</option>
                <option value={StoryType.FIX}>Bug Fixes</option>
                <option value={StoryType.REFACTOR}>Refactors</option>
              </select>
            </div>
          </div>

          <Timeline
            events={filteredEvents}
            onShowTicket={(event) => setSelectedTicket(event)}
          />
        </div>
      )}
    </div>
  );
};
