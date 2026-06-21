import React from "react";

const Legal = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold mb-4">
          Legal Information
        </h1>

        <p className="text-gray-400 mb-16">
          Last updated: June 2026
        </p>

        {/* Privacy Policy */}
        <section id="privacy" className="mb-20">
          <h2 className="text-3xl font-bold mb-6">
            Privacy Policy
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed">

            <p>
              RepoAI respects your privacy and is committed to
              protecting your information.
            </p>

            <p>
              We may collect basic information such as repository
              URLs, usage analytics, browser information, and
              interaction data necessary to provide and improve
              our services.
            </p>

            <p>
              We do not sell personal information to third
              parties.
            </p>

            <p>
              Repository analysis data is used solely to provide
              repository insights, code understanding, and AI
              generated responses.
            </p>

            <p>
              We implement industry-standard security measures to
              protect information from unauthorized access,
              disclosure, or misuse.
            </p>

            <p>
              By using RepoAI, you consent to the collection and
              use of information as described in this policy.
            </p>

          </div>
        </section>

        {/* Terms */}
        <section id="terms" className="mb-20">
          <h2 className="text-3xl font-bold mb-6">
            Terms & Conditions
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed">

            <p>
              By accessing or using RepoAI, you agree to these
              Terms and Conditions.
            </p>

            <p>
              RepoAI provides AI-powered repository analysis and
              code understanding services. While we strive for
              accuracy, generated responses may contain errors
              and should be independently verified.
            </p>

            <p>
              Users are responsible for ensuring they have the
              right to analyze and interact with repositories
              submitted to the platform.
            </p>

            <p>
              You agree not to misuse the service, attempt
              unauthorized access, disrupt platform operations,
              or use RepoAI for unlawful purposes.
            </p>

            <p>
              RepoAI reserves the right to suspend or terminate
              access to users who violate these terms.
            </p>

            <p>
              The service is provided "as is" without warranties
              of any kind.
            </p>

            <p>
              RepoAI shall not be liable for any indirect,
              incidental, or consequential damages arising from
              use of the service.
            </p>

          </div>
        </section>

        {/* Cookie Policy */}
        <section id="cookies">
          <h2 className="text-3xl font-bold mb-6">
            Cookie Policy
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed">

            <p>
              RepoAI uses cookies and similar technologies to
              enhance user experience and improve platform
              functionality.
            </p>

            <p>
              Cookies may be used to remember preferences,
              maintain sessions, analyze traffic patterns, and
              improve service performance.
            </p>

            <p>
              Third-party analytics providers may also place
              cookies to help us understand how visitors use the
              platform.
            </p>

            <p>
              You can manage or disable cookies through your
              browser settings. Some features may not function
              properly if cookies are disabled.
            </p>

            <p>
              Continued use of RepoAI indicates acceptance of
              this Cookie Policy.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Legal;