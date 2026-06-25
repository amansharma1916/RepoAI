import React from "react";
import { useEffect, useState } from "react";



const About = () => {


    useEffect(() => {
        const handleScroll = () => {
          setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-24">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            About RepoAI
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Understand Any
            <br />
            <span className="gradient-text">
              Repository Instantly
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-400">
            RepoAI is an AI-powered repository intelligence platform
            that helps developers explore, understand and navigate
            complex codebases using natural language.
          </p>
        </div>

        {/* Story Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-24">

          <div className="p-8 rounded-2xl bg-dark-800/50 border border-white/5">
            <h3 className="text-white text-xl font-semibold mb-4">
              The Problem
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Developers spend hours exploring unfamiliar repositories,
              tracing dependencies and understanding architecture before
              they can make meaningful contributions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-dark-800/50 border border-white/5">
            <h3 className="text-white text-xl font-semibold mb-4">
              Our Solution
            </h3>

            <p className="text-gray-400 leading-relaxed">
              RepoAI converts any repository into a searchable,
              explainable knowledge base powered by advanced code
              analysis and AI reasoning.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-dark-800/50 border border-white/5">
            <h3 className="text-white text-xl font-semibold mb-4">
              The Result
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Developers onboard faster, understand architecture
              instantly and spend more time building instead of
              searching through files.
            </p>
          </div>

        </div>

        {/* Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            What RepoAI Understands
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">

          {[
            "Functions & Methods",
            "Classes & Components",
            "Dependencies",
            "Architecture",
            "Database Models",
            "API Routes",
            "Code Relationships",
            "Repository Structure",
          ].map((item) => (
            <div
              key={item}
              className="p-5 rounded-xl bg-dark-800/40 border border-white/5 text-center"
            >
              <span className="text-gray-300">
                {item}
              </span>
            </div>
          ))}

        </div>

        {/* Contact Section */}
        <div
          id="contact"
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-3xl bg-dark-800/60 border border-white/5 p-8 lg:p-12">

            <div className="text-center mb-10">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
                Contact
              </span>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Get In Touch
              </h2>

              <p className="text-gray-400">
                Questions, feedback, feature requests or partnership
                opportunities? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="p-6 rounded-2xl bg-dark-700/50 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    ✉️
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      Email
                    </h3>
                  </div>
                </div>

                <p className="text-gray-400">
                  amansharmayt19@gmail.com
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-dark-700/50 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    💬
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      Support
                    </h3>
                  </div>
                </div>

                <p className="text-gray-400">
                  amansharmayt19@gmail.com
                </p>
              </div>

            </div>

            {/* Contact Form */}
            {/* <div id="contact" className="mt-8">
              <form className="space-y-4">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-accent/40"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-accent/40"
                />

                <textarea
                  rows={5}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-accent/40 resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-accent text-dark-900 font-semibold hover:bg-accent-light transition-colors"
                >
                  Send Message
                </button>

              </form>
            </div> */}

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;