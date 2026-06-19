import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const TreeNode = ({ node }) => {
  return (
    <ul className="ml-4 border-l border-slate-200 pl-4">
      {Object.entries(node).map(
        ([key, value]) => (
          <li
            key={key}
            className="py-1"
          >
            <span className="text-white">
              {key}
            </span>

            {Object.keys(value).length > 0 && (
              <TreeNode node={value} />
            )}
          </li>
        )
      )}
    </ul>
  );
};


const Dashboard = () => {
  const [githubUrl, setGithubUrl] = useState("");

  const [repositoryId, setRepositoryId] = useState(null);

  const [repositoryData, setRepositoryData] = useState(null);

  const [showData, setShowData] = useState(false);

  const [showTree, setShowTree] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  const [tree, setTree] = useState(null);
  const [files, setFiles] = useState([]);

  const [treeLoaded, setTreeLoaded] = useState(false);
  const [filesLoaded, setFilesLoaded] = useState(false);

  const [treeLoading, setTreeLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [dots, setDots] = useState(".");

  const handleClick = async () => {
    if (!githubUrl.trim() || !githubUrl.includes("github.com")) {
      alert("Please enter a valid GitHub URL");
      return;
    }

    try {
      setIsAnalyzing(true);

      const res = await apiClient.post(
        "/repository/analyze",
        {
          githubUrl,
        }
      );

      const repoId = res.data.repository.id;

      setRepositoryId(repoId);

      const overviewRes = await apiClient.get(
        `/repository/summary/${repoId}`
      );

      setRepositoryData(overviewRes.data);

      setShowData(true);

      // Reset old repository data
      setTree(null);
      setFiles([]);

      setTreeLoaded(false);
      setFilesLoaded(false);

      setShowTree(false);
      setShowFiles(false);

      setGithubUrl("");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to analyze repository"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShowTree = async () => {
    const nextState = !showTree;

    setShowTree(nextState);

    if (!nextState) return;

    if (treeLoaded) return;

    try {
      setTreeLoading(true);

      const res = await apiClient.get(
        `/repository/tree/${repositoryId}`
      );

      setTree(res.data);

      setTreeLoaded(true);
    } catch (error) {
      console.error(error);

      alert("Failed to load repository tree");
    } finally {
      setTreeLoading(false);
    }
  };



  const handleShowFiles = async () => {
    const nextState = !showFiles;

    setShowFiles(nextState);

    if (!nextState) return;

    if (filesLoaded) return;

    try {
      setFilesLoading(true);

      const res = await apiClient.get(
        `/repository/files/${repositoryId}`
      );

      setFiles(res.data.files);

      setFilesLoaded(true);
    } catch (error) {
      console.error(error);

      alert("Failed to load files");
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const buttons = [
    { label: "Show Tree", onClick: () => setShowTree(!showTree) },
    { label: "Show Files", onClick: () => setShowFiles(!showFiles) },
  ];


  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl">
          <h1 className="text-4xl font-bold">
            Git Repository Knowledge Base
          </h1>

          <p className="mt-3 text-slate-400">
            Analyze GitHub repositories and explore their architecture,
            technologies, file structure, and statistics.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              GitHub Repository URL
            </label>

            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repository"
              className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-950
              px-5
              py-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition
              focus:border-blue-500
            "
            />
          </div>

          <button
            onClick={handleClick}
            disabled={isAnalyzing}
            className="
            mt-6
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            px-8
            py-4
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          >
            Analyze Repository
          </button>
        </div>

        {/* Loading */}
        {isAnalyzing && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">
              Analyzing Repository
              <span className="ml-1 text-cyan-400">{dots}</span>
            </h2>

            <p className="mt-3 text-slate-400">
              Cloning repository, indexing files and generating metadata.
            </p>
          </div>
        )}

        {/* Repository Overview */}
        {showData && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-3xl font-bold">
              Repository Overview
            </h2>

            {/* Stats */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-500">
                  Total Files
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {repositoryData?.stats?.total_files}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-500">
                  Total Folders
                </p>

                <p className="mt-2 text-3xl font-bold text-green-400">
                  {repositoryData?.stats?.total_folders}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-500">
                  Repository Size
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-400">
                  {(
                    repositoryData?.stats?.total_size / 1000000
                  ).toFixed(2)}
                  MB
                </p>
              </div>
            </div>

            {/* Repository Info */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="mb-4 text-xl font-semibold">
                Repository Details
              </h3>

              <div className="space-y-3 text-slate-300">
                <p>
                  <span className="font-semibold text-white">
                    Repository ID:
                  </span>{" "}
                  {repositoryData?.repository?.id}
                </p>

                <p>
                  <span className="font-semibold text-white">
                    Status:
                  </span>{" "}
                  {repositoryData?.repository?.status}
                </p>

                <p>
                  <span className="font-semibold text-white">
                    GitHub URL:
                  </span>{" "}
                  {repositoryData?.repository?.github_url}
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold">
                Technologies
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {repositoryData?.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="
                    rounded-full
                    border
                    border-cyan-500/30
                    bg-cyan-500/10
                    px-4
                    py-2
                    text-sm
                    text-cyan-300
                  "
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold">
                Languages
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(
                  repositoryData?.stats?.languages || {}
                ).map(([language, count]) => (
                  <span
                    key={language}
                    className="
                    rounded-full
                    border
                    border-blue-500/30
                    bg-blue-500/10
                    px-4
                    py-2
                    text-sm
                    text-blue-300
                  "
                  >
                    {language}: {count}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={handleShowTree}
                className="
                rounded-2xl
                border
                border-slate-700
                bg-slate-950
                px-6
                py-3
                transition
                hover:border-blue-500
              "
              >
                {showTree ? "Hide Tree" : "Show Tree"}
              </button>

              <button
                onClick={handleShowFiles}
                className="
                rounded-2xl
                border
                border-slate-700
                bg-slate-950
                px-6
                py-3
                transition
                hover:border-cyan-500
              "
              >
                {showFiles ? "Hide Files" : "Show Files"}
              </button>
            </div>
          </div>
        )}

        {/* Tree */}
        {showTree && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">
              Repository Tree
            </h2>

            <div className="mt-6 rounded-2xl border text-white border-slate-800 bg-slate-950 p-5 overflow-auto">
              {tree && <TreeNode node={tree} />}
            </div>
          </div>
        )}

        {/* Files */}
        {showFiles && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">
              Repository Files
            </h2>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <ul className="space-y-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-900
                    px-4
                    py-3
                    hover:border-blue-500
                    transition
                  "
                  >
                    {file.file_path}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};


export default Dashboard;