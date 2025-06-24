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
                site data, your resume information will be permanently deleted from
                your machine.
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
            <AccordionTrigger>Is my API key secure?</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                Yes. Your API key is also stored in your browser's local
                storage and is{' '}
                <span className="font-bold">
                  only sent directly from your browser to the AI provider you
                  select
                </span>{' '}
                (e.g., Google, OpenAI).
              </p>
              <p>
                It is never sent to or stored on our servers. It remains on
                your machine and under your control.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
