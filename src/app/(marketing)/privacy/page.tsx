
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Resumeeee',
  description: 'Our commitment to your privacy. Learn how Resumeeee handles your data.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 text-lg leading-relaxed text-foreground">
        <h1 className="text-4xl font-bold tracking-tight text-center">Privacy Policy</h1>
        <p className="text-center text-muted-foreground">Last updated: June 25, 2024</p>
        
        <div className="prose prose-lg mx-auto max-w-none">
            <p>
                Your privacy is the most important thing to us. This application, Resumeeee, was built from the ground up with a "privacy-first" approach. This policy outlines what data we handle and, more importantly, what we don't.
            </p>

            <h2 className="text-2xl font-semibold mt-8">The Golden Rule: Your Data is Yours</h2>
            <p>
                All data you enter into this application—including your name, work history, skills, and any other personal information—is stored exclusively in your web browser's <strong>local storage</strong>.
            </p>
            <p>
                This means:
            </p>
            <ul>
                <li>Your data lives only on your computer.</li>
                <li>We do not have a server database that stores your resume content.</li>
                <li>We cannot see, access, or share your resume data.</li>
                <li>If you clear your browser's cache or site data, your resume information will be permanently deleted, because it only ever existed on your machine.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">API Key Security ("Bring Your Own Key")</h2>
            <p>
                The AI features in this app (like resume parsing and content improvement) are powered by third-party services (e.g., Google AI, OpenAI). To use these features, you provide your own API key.
            </p>
            <p>
                Your API key is also stored <strong>only in your browser's local storage</strong>.
            </p>
            <ul>
                <li>Your API key is never sent to our servers.</li>
                <li>When you use an AI feature, your browser makes a direct request to the AI provider's service (e.g., Google's API). Your key and the relevant data for that request are sent to them, but not to us.</li>
                <li>This gives you full control over your API usage and ensures maximum security.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">Analytics and Tracking</h2>
            <p>
                This application does not use any user-identifying analytics or tracking cookies. We have no interest in tracking your behavior across the web.
            </p>

            <h2 className="text-2xl font-semibold mt-8">Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy in the future. Any changes will be posted on this page. We encourage you to review this page periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please don't hesitate to <a href="/contact">contact us</a>.
            </p>
        </div>
      </div>
    </div>
  );
}
