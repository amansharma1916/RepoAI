import { useState } from "react";
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
            <span className="text-slate-700">
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
  const [showTree, setShowTree] = useState(false);
  const [tree, setTree] = useState(null);
  const [showFiles, setShowFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [showData, setShowData] = useState(false);
  const [repositoryData, setrepositoryData] = useState({
    // "repository": {
    //     "id": 21,
    //     "github_url": "https://github.com/web-codings123/EazyWed",
    //     "status": "completed",
    //     "created_at": "2026-06-15T16:02:12.221Z"
    // },
    // "stats": {
    //     "id": 6,
    //     "repository_id": 21,
    //     "total_files": 127,
    //     "total_folders": 17,
    //     "total_size": "1901330",
    //     "languages": {
    //         "CSS": 25,
    //         "HTML": 1,
    //         "JavaScript": 84
    //     },
    //     "created_at": "2026-06-15T16:02:14.031Z",
    //     "updated_at": "2026-06-15T16:02:14.031Z"
    // },
    // "technologies": [
    //     "Bootstrap",
    //     "Express",
    //     "MongoDB",
    //     "React",
    //     "Vite"
    // ]
  });
  const handleClick = async () => {
    try {
      const res = await apiClient.post("/repository/analyze", { githubUrl });
      console.log(res.data);
      setGithubUrl("");
      alert("Repository added successfully!");
      const overviewRes = await apiClient.get(`/repository/overview/${res.data.repository.id}`);
      console.log(overviewRes.data);
      setrepositoryData(overviewRes.data);
      const treeRes = await apiClient.get(
        `/repository/tree/${res.data.repository.id}`
      );
      setTree(treeRes.data);
      const filesRes = await apiClient.get(
        `/repository/files/${res.data.repository.id}`
      );
      console.log(filesRes.data.files);
      setFiles(filesRes.data.files);
      setShowTree(true);
      setShowData(true);
      setShowFiles(true);
    } catch (error) {
      console.error(error);
      alert(error.response.data.message)
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Git Repository Knowledge Base
          </h1>

          <p className="mt-3 text-slate-600">
            Analyze any GitHub repository and understand its structure,
            technologies, files, and architecture.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              GitHub Repository URL
            </label>

            <input
              type="text"
              placeholder="https://github.com/user/repository"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <button
            onClick={handleClick}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Analyze Repository
          </button>
        </div>
      </div>
      {showData && (
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Repository Overview
            </h2>

            <p className="mt-3 text-slate-600">
              Here is the overview of the analyzed repository.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-900">Repository Details</h3>
              <p><strong>ID:</strong> {repositoryData.repository.id}</p>
              <p><strong>GitHub URL:</strong> {repositoryData.repository.github_url}</p>
              <p><strong>Status:</strong> {repositoryData.repository.status}</p>
              <p><strong>Created At:</strong> {new Date(repositoryData.repository.created_at).toLocaleString()}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-900">Statistics</h3>
              <p><strong>Total Files:</strong> {repositoryData.stats.total_files}</p>
              <p><strong>Total Folders:</strong> {repositoryData.stats.total_folders}</p>
              <p><strong>Total Size:</strong> {(repositoryData.stats.total_size) / 1000000} MB</p>
              <p><strong>Languages:</strong></p>
              <ul>
                {Object.entries(repositoryData.stats.languages).map(([language, count]) => (
                  <li key={language}>{language}: {count}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-900">Technologies</h3>
              <ul>
                {repositoryData.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showTree && (
      <div className="mt-8 mx-auto max-w-4xl px-6 py-12 bg-white">
        <h3 className="text-xl font-semibold text-slate-900">
          Repository Tree
        </h3>

        {tree && (
          <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4 bg-slate-50 overflow-auto">
            <TreeNode node={tree} />
          </div>
        )}
      </div> )}

      {showFiles && (
      <div className="mt-8 mx-auto max-w-4xl px-6 py-12 bg-white">
        <h3 className="text-xl font-semibold text-slate-900">
          Repository Files
        </h3>

        {files.length > 0 && (
          <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4 bg-slate-50 overflow-auto">
            <ul>
              {files.map((file) => (
                <li key={file.id}>{file.file_path}</li>
              ))}
            </ul>
          </div>
        )}
      </div> )}
    </div>
  );
};


export default Dashboard;