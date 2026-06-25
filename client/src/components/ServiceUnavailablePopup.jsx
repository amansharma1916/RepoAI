import React, { useState, useEffect } from "react";

const ServiceUnavailablePopup = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Popup Content */}
      <div
        className={`relative bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-2xl w-full shadow-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            Service Temporarily Unavailable
          </h2>
          <p className="text-gray-300 leading-relaxed">
            The backend server and worker are currently not running. You can view the demo video below to see how RepoAI works, or contact the developer for assistance.
          </p>
        </div>

        {/* Video */}
        <div className="rounded-xl overflow-hidden bg-black">
          <video
            controls
            autoPlay
            muted
            loop
            className="w-full"
            src="/demo.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Contact Info */}
        <div className="mt-6 p-4 bg-dark-700/50 rounded-xl border border-dark-600">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-semibold">Contact Developer:</span>{" "}
            For immediate assistance, please reach out to the development team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceUnavailablePopup;