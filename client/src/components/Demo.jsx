import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBackground from "./HeroBackground";
const files = [
  "auth.controller.ts",
  "auth.middleware.ts",
  "jwt.service.ts",
  "user.repository.ts",
  "token.service.ts",
];

const analysisSteps = [
  "Scanning repository...",
  "Analyzing authentication files...",
  "Extracting symbols...",
  "Building dependency graph...",
  "Generating explanation...",
];

const finalAnswer =
  "Authentication uses JWT tokens with refresh-token rotation. Login requests are validated in auth.controller.ts, token generation occurs in jwt.service.ts, and protected routes are secured by auth.middleware.ts.";

const Demo = () => {
  const [progress, setProgress] = useState(0);
  const [visibleFiles, setVisibleFiles] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const fileInterval = setInterval(() => {
      setVisibleFiles((prev) => {
        if (prev < files.length) {
          return prev + 1;
        }
        clearInterval(fileInterval);
        return prev;
      });
    }, 700);

    return () => clearInterval(fileInterval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;

    let i = 0;

    const typing = setInterval(() => {
      setTypedText(finalAnswer.slice(0, i));
      i++;

      if (i > finalAnswer.length) {
        clearInterval(typing);
      }
    }, 20);

    return () => clearInterval(typing);
  }, [progress]);

  return (
    <section
      id="demo"
      className="relative py-32 overflow-hidden"
    >
      <HeroBackground />
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        />

        <motion.div
          animate={{
            y: [20, -20, 20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-accent uppercase tracking-widest text-sm font-semibold">
            Interactive Demo
          </span>

          <h2 className="mt-4 text-5xl lg:text-6xl font-bold text-white">
            Watch RepoAI
            <span className="gradient-text block">
              Investigate Your Code
            </span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Not a chatbot. An AI engineer that explores,
            traces and explains your repository.
          </p>
        </motion.div>

        <div className="rounded-3xl border border-white/10 bg-dark-800/70 backdrop-blur-xl overflow-hidden">

          {/* Query */}
          <div className="border-b border-white/10 p-6">
            <div className="bg-dark-700 rounded-2xl p-5 text-gray-200">
              <span className="text-accent mr-2">{">"}</span>
              How does authentication work in this repository?
            </div>
          </div>

          {/* Progress */}
          <div className="px-6 pt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">
                {analysisSteps[currentStep]}
              </span>

              <span className="text-sm text-accent">
                {progress}%
              </span>
            </div>

            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  ease: "linear",
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 p-6">
            {[
              { label: "Files Scanned", value: "12" },
              { label: "Symbols Found", value: "28" },
              { label: "Dependencies", value: "43" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.2,
                }}
                className="bg-dark-700 rounded-2xl p-5"
              >
                <p className="text-gray-500 text-sm">
                  {item.label}
                </p>

                <h3 className="text-4xl font-bold text-white mt-2">
                  {item.value}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-6 p-6">

            {/* Scanner Panel */}
            <div className="bg-dark-700 rounded-3xl p-6">
              <h3 className="text-white text-lg font-semibold mb-6">
                Repository Investigation
              </h3>

              <div className="space-y-3">

                <AnimatePresence>
                  {files
                    .slice(0, visibleFiles)
                    .map((file) => (
                      <motion.div
                        key={file}
                        initial={{
                          opacity: 0,
                          x: -40,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-dark-800 border border-white/5"
                      >
                        <span className="text-gray-300">
                          {file}
                        </span>

                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                          className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-black"
                        >
                          ✓
                        </motion.div>
                      </motion.div>
                    ))}
                </AnimatePresence>

              </div>
            </div>
                        {/* Flow + Answer Panel */}
            <div className="bg-dark-700 rounded-3xl p-6">
              <h3 className="text-white text-lg font-semibold mb-8">
                Authentication Flow
              </h3>

              {/* Flow Diagram */}
              <div className="mb-10">
                <div className="flex flex-wrap justify-center items-center gap-2">

                  {[
                    "Login",
                    "Validate User",
                    "Generate JWT",
                    "Refresh Token",
                    "Response",
                  ].map((node, index) => (
                    <React.Fragment key={node}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: progress > 30 ? 1 : 0,
                          scale: progress > 30 ? 1 : 0.8,
                        }}
                        transition={{
                          delay: index * 0.3,
                        }}
                        className="relative px-4 py-3 rounded-xl bg-dark-800 border border-white/5"
                      >
                        <motion.div
                          animate={{
                            boxShadow:
                              progress > 30
                                ? [
                                    "0 0 0px rgba(0,0,0,0)",
                                    "0 0 20px rgba(34,197,94,0.4)",
                                    "0 0 0px rgba(0,0,0,0)",
                                  ]
                                : "",
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 rounded-xl"
                        />

                        <span className="relative text-gray-300 text-sm">
                          {node}
                        </span>
                      </motion.div>

                      {index !== 4 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: progress > 45 ? 40 : 0,
                          }}
                          transition={{
                            duration: 0.8,
                          }}
                          className="h-[2px] bg-accent"
                        />
                      )}
                    </React.Fragment>
                  ))}

                </div>
              </div>

              {/* Generated Answer */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: progress > 60 ? 1 : 0,
                  y: progress > 60 ? 0 : 20,
                }}
                className="rounded-2xl bg-dark-800 border border-accent/20 p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.4, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-accent"
                  />

                  <span className="text-accent text-sm font-medium">
                    Generated Explanation
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed min-h-[140px]">
                  {typedText}
                  <motion.span
                    animate={{
                      opacity: [1, 0, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="inline-block ml-1"
                  >
                    |
                  </motion.span>
                </p>

                {/* References */}
                <AnimatePresence>
                  {progress === 100 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-6 flex flex-wrap gap-2"
                    >
                      {[
                        "auth.controller.ts:45",
                        "auth.middleware.ts:12",
                        "jwt.service.ts:28",
                      ].map((ref, i) => (
                        <motion.div
                          key={ref}
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            delay: i * 0.15,
                          }}
                          className="px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs cursor-pointer hover:bg-accent/20 transition-colors"
                        >
                          {ref}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;