import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import HeroBackground from "../HeroBackground";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, loginUser } from "../../services/auth.service";
import { useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleAuth(
        credentialResponse.credential
      );

      console.log("Login Success:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Backend Authentication Failed:", error);
    }
  };


   const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(formData);
      console.log("Login Success:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <section className="relative min-h-screen bg-dark-900 overflow-hidden">
      <HeroBackground />
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-accent/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 min-h-screen flex">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-[70%] relative items-center px-16 overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-[14rem] font-black text-white/[1] tracking-wider select-none">
              REPOAI
            </h1>
          </div>

          {/* <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/80 border border-accent/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-gray-300">
                AI Powered Repository Intelligence
              </span>
            </div>

            <h1 className="text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="gradient-text">RepoAI</span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mb-12">
              Understand complex codebases instantly. Ask questions, trace
              dependencies, discover architecture, and onboard to any GitHub
              repository with the power of AI.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <FeatureCard
                title="AI Repository Chat"
                description="Ask questions in natural language and get instant answers."
              />

              <FeatureCard
                title="Architecture Analysis"
                description="Understand project structure in seconds."
              />

              <FeatureCard
                title="Code Tracing"
                description="Track execution flow across files and modules."
              />

              <FeatureCard
                title="Semantic Search"
                description="Find relevant code using vector embeddings."
              />
            </div>

            <div className="flex gap-12 mt-12">
              <div>
                <h3 className="text-3xl font-bold text-white">100+</h3>
                <p className="text-gray-500 mt-1">Repositories Analyzed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">50+</h3>
                <p className="text-gray-500 mt-1">Questions Answered</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">99%</h3>
                <p className="text-gray-500 mt-1">Answer Accuracy</p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="hidden lg:flex relative items-center justify-center">
          <div className="h-[80%] w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
          <div className="absolute h-[80%] w-[2px] bg-accent/20 blur-md" />
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="bg-dark-800/70 backdrop-blur-xl border border-dark-600 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Welcome Back
                </h2>

                <p className="text-gray-400 mt-2">
                  Sign in to continue to RepoAI
                </p>
              </div>

              <div className="w-full overflow-hidden flex justify-center">
                <GoogleLogin
                  width="350"
                  size="large"
                  shape="rectangular"
                  text="continue_with"
                  theme="filled_white"
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="border-t border-dark-600" />

                <span
                  className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    -top-3
                    bg-dark-800
                    px-4
                    text-sm
                    text-gray-500
                  "
                >
                  OR
                </span>
              </div>

              {/* Email */}
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-dark-700
                    border
                    border-dark-600
                    text-white
                    placeholder-gray-500
                    focus:outline-none
                    focus:border-accent
                    transition
                  "
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-dark-700
                    border
                    border-dark-600
                    text-white
                    placeholder-gray-500
                    focus:outline-none
                    focus:border-accent
                    transition
                  "
                />
              </div>

              {/* Sign In */}
              <button

                onClick={handleLogin}
                disabled={loading}
                className="
                  w-full
                  h-12
                  mt-6
                  rounded-xl
                  bg-accent
                  text-dark-900
                  font-bold
                  hover:bg-accent-light
                  transition-all
                "
              >
                Sign In
              </button>

              {/* Forgot Password */}
              <div className="text-center mt-4">
                <button className="text-sm text-gray-400 hover:text-accent transition">
                  Forgot Password?
                </button>
              </div>

              {/* Signup */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?
                </p>

                <Link to="/signup" className="mt-2 text-accent font-semibold hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-dark-800/40 backdrop-blur-sm border border-dark-700 rounded-2xl p-5 hover:border-accent/30 transition-all duration-300">
      <h3 className="text-white font-semibold mb-2">{title}</h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default LoginPage;