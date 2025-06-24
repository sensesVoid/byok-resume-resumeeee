'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AboutModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AboutModal({ isOpen, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>About Resumeeee</DialogTitle>
          <DialogDescription>
            Frequently asked questions about how this application works.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-0">
            <AccordionTrigger>What is the goal of Resumeee?</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                Resumeee aims to provide a free, powerful, and user-friendly tool to help job seekers create professional resumes and cover letters. By leveraging AI and providing a clean, modern interface, it seeks to level the playing field, making high-quality application materials accessible to everyone—without hidden fees, subscriptions, or data harvesting.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>Where is my resume data saved?</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                Your resume data is saved automatically and securely in your
                browser's local storage. This allows you to refresh the page or
                close the browser and still have your progress restored when you
                return.
              </p>
              <p className="font-semibold text-destructive/90">
                However, this means that if you clear your browser's cache or
                site data, your resume information will be permanently deleted
                from your machine.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Why do I need an API key for AI features?
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                This application integrates with powerful third-party AI models
                from providers like Google and OpenAI to offer features like
                content improvement and resume parsing. These services require
                an API key for authentication and to manage usage.
              </p>
              <p>
                By using your own key, you get direct access to these
                state-of-the-art tools within the resume builder.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is my API key and data secure?</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                Absolutely. Your API key and all your resume content are stored
                exclusively in your browser's local storage. They are{' '}
                <span className="font-bold">
                  never sent to or stored on our servers.
                </span>{' '}
                When you use an AI feature, your browser sends the necessary
                data directly to the AI provider you select (e.g., Google,
                OpenAI).
              </p>
              <p>
                Your information remains on your machine and under your
                control.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              How does the ATS Score Checker work?
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                The ATS (Applicant Tracking System) Score Checker is an
                AI-powered simulation. It analyzes your resume or cover letter
                against the job description you provide, just like a real ATS
                might.
              </p>
              <p>
                It identifies matching keywords, assesses formatting from a
                machine-readability standpoint, and finds skill gaps to help
                you tailor your application and increase your chances of
                getting noticed by recruiters.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Can I use this app offline?</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                Yes! You can edit your resume and use all non-AI features
                completely offline. Since all your data is stored in your
                browser, you don't need an internet connection to access or
                modify your content.
              </p>
              <p>
                An internet connection is only required when you use the
                AI-powered features (like parsing, content improvement, or ATS
                checks) as they need to communicate with the external AI
                providers.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>How can I support this app?</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                If you find this app helpful, thank you for considering
                supporting its development!
              </p>
              <p>
                If the creator of this app has configured donation methods, you will see a "Donate" button in the header. Clicking it will take you to a page with QR codes for services like Maya or PayPal.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
