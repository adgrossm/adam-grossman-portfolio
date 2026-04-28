export const metadata = {
  title: "Privacy Policy | Adam Grossman",
  description: "Privacy policy for adamgrossman.com",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 28, 2026</p>

      <div className="space-y-6 text-base leading-relaxed">
        <p>
          This site uses Google Analytics to understand how visitors interact with its content.
          Google Analytics collects anonymized data such as pages visited, time on site, and general
          geographic location. No personally identifiable information is collected or stored.
        </p>
        <p>
          Data collected through Google Analytics is governed by Google's Privacy Policy. You can
          opt out of Google Analytics tracking by using the{" "}
          
            <a href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70 transition-opacity"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>
        <p>
          This site does not sell, share, or otherwise distribute visitor data to any third party
          beyond what is inherent in the use of Google Analytics.
        </p>
        <p>
         If you have questions about this policy, you can reach out at{" "}
          
          <a   href="mailto:adgrossm@gmail.com"
            className="underline hover:opacity-70 transition-opacity"
          >
            adgrossm@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}