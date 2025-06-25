
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Resumeeee',
  description: 'Learn about the mission and features of Resumeeee, the free AI-powered resume builder.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 text-lg leading-relaxed text-foreground">
        <h1 className="text-4xl font-bold tracking-tight text-center">About Resumeeee</h1>
        <p className="text-xl text-center text-muted-foreground">
          Empowering job seekers with a free, private, and powerful tool to build the perfect resume.
        </p>

        <div className="prose prose-lg mx-auto max-w-none">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p>
                Job hunting is stressful. The last thing you need is to worry about subscription fees, hidden paywalls, or how your personal data is being used. Resumeeee was built with one simple goal: to create a powerful, modern, and completely free tool to help people build professional resumes and cover letters without the usual hassle.
            </p>
            <p>
                We believe everyone deserves access to high-quality tools to advance their career. This project is our contribution to making that a reality.
            </p>

            <h2 className="text-2xl font-semibold mt-8">Core Features</h2>
            <ul>
                <li><strong>AI-Powered Assistance:</strong> Leverage AI to parse existing resumes, improve your content, check your resume against job descriptions (ATS score), and generate tailored cover letters.</li>
                <li><strong>Privacy First:</strong> All your data, including your resume content and any API keys you use, is stored exclusively in your browser's local storage. It never touches our servers. Your data stays yours.</li>
                <li><strong>Real-time Preview:</strong> Instantly see how your resume looks as you type with a live, side-by-side preview.</li>
                <li><strong>Customizable Templates:</strong> Choose from a variety of professional templates and customize fonts and colors to match your style.</li>
                <li><strong>Flexible Export:</strong> Download your resume or cover letter as a pixel-perfect PDF or an editable DOCX file.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">How It Works (The "BYOK" Model)</h2>
            <p>
                To keep this tool free and give you full control, Resumeeee operates on a "Bring Your Own Key" (BYOK) model. Instead of charging you, we allow you to connect your own API key from providers like Google AI, OpenAI, or OpenRouter.
            </p>
            <p>
                This means your API calls go directly from your browser to the provider you choose. It's secure, private, and keeps you in control of your usage and data.
            </p>
        </div>
      </div>
    </div>
  );
}
