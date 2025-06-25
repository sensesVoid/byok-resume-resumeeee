'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bot, Loader2 } from 'lucide-react';
import { Typewriter } from './typewriter';
import { useState, useEffect } from 'react';

interface AiTaskModalProps {
  isOpen: boolean;
  title: string;
  messages: string[];
}

export function AiTaskModal({ isOpen, title, messages }: AiTaskModalProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCurrentMessageIndex(0);
      setCompletedMessages([]);
    }
  }, [isOpen]);

  const handleMessageComplete = () => {
    setCompletedMessages((prev) => [...prev, messages[currentMessageIndex]]);
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
          {completedMessages.map((msg, index) => (
            <div
              key={index}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <Bot className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{msg}</p>
            </div>
          ))}
          {isOpen && currentMessageIndex < messages.length && (
            <div className="flex items-start gap-3">
              <Bot className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <p className="font-medium text-foreground">
                <Typewriter
                  key={currentMessageIndex}
                  text={messages[currentMessageIndex]}
                  speed={30}
                  onComplete={handleMessageComplete}
                />
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
