import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import HeroBackground from "../HeroBackground";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, registerUser } from "../../services/auth.service";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
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


    const handleRegister = async (e) => {
      e.preventDefault();

      if (!formData.agreeToTerms) {
        alert("You must agree to the Terms of Service and Privacy Policy.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      if (!formData.fullName || !formData.email || !formData.password) {
        alert("Please fill in all required fields.");
        return;
      }

      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      setLoading(true);
      try{
        const response = await registerUser(payload);
        console.log("Registration Success:", response);
        navigate("/login");
      }catch(error){
        console.error("Registration Failed:", error);
      } finally {
        setLoading(false);
      }

    }



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
                Join Thousands of Developers
              </span>
            </div>

            <h1 className="text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-white">Start Building With</span>
              <br />
              <span className="gradient-text">RepoAI</span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mb-12">
              Transform any GitHub repository into an AI-powered knowledge
              base. Understand architecture, discover code relationships,
              and onboard faster than ever.
            </p>

            <div className="space-y-5">
              <BenefitItem text="Analyze repositories in minutes" />
              <BenefitItem text="Chat with your codebase using AI" />
              <BenefitItem text="Explore architecture visually" />
              <BenefitItem text="Find code instantly with semantic search" />
              <BenefitItem text="Trace dependencies and execution flow" />
            </div>

            <div className="flex gap-12 mt-12">
              <div>
                <h3 className="text-3xl font-bold text-white">100+</h3>
                <p className="text-gray-500 mt-1">Repositories Indexed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">50+</h3>
                <p className="text-gray-500 mt-1">AI Queries Processed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">99%</h3>
                <p className="text-gray-500 mt-1">Developer Satisfaction</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Divider */}
        <div className="hidden lg:flex relative items-center justify-center">
          <div className="h-[80%] w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
          <div className="absolute h-[80%] w-[2px] bg-accent/20 blur-md" />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[30%] flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="bg-dark-800/70 backdrop-blur-xl border border-dark-600 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Create Account
                </h2>

                <p className="text-gray-400 mt-2">
                  Start exploring repositories with AI
                </p>
              </div>

              {/* Google Signup */}
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

              {/* Form */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
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
                  "
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  "
                />

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
                  "
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
                  "
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 mt-5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      agreeToTerms: e.target.checked,
                    }))}
                  className="mt-1 accent-accent"
                />

                <span className="text-sm text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-accent hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-accent hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Signup Button */}
              <button
                onClick={handleRegister}
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
                Create Account
              </button>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?
                </p>

                <Link to="/login" className="mt-2 text-accent font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ text }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>

      <span className="text-lg text-gray-300">{text}</span>
    </div>
  );
};

export default RegisterPage;