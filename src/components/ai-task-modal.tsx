
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Bot, Loader2 } from 'lucide-react';
import { Typewriter } from './typewriter';
import { useState, useEffect, useCallback } from 'react';

interface AiTaskModalProps {
  isOpen: boolean;
  title: string;
  messages: string[];
}

export function AiTaskModal({ isOpen, title, messages }: AiTaskModalProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);

  const allMessagesTyped = currentMessageIndex >= messages.length;

  useEffect(() => {
    // Reset state when the modal opens
    if (isOpen) {
      setCurrentMessageIndex(0);
      setCompletedMessages([]);
    }
  }, [isOpen]); // Depend only on isOpen to reset

  // Memoize the callback to prevent it from being recreated on every render.
  // This is the key fix for the infinite loop.
  const handleMessageComplete = useCallback(() => {
    // Use functional updates to get the latest state without needing it in dependencies
    setCompletedMessages((prev) => [...prev, messages[prev.length]]);
    setCurrentMessageIndex((prev) => prev + 1);
  }, [messages]); // The callback only needs to change if the messages array itself changes.

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {title}
          </DialogTitle>
          {/* Add DialogDescription to fix accessibility warning */}
          <DialogDescription>
            The AI is processing your request. Please wait a moment.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
          {/* Display all the messages that have finished typing */}
          {completedMessages.map((msg, index) => (
            <div
              key={`completed-${index}`}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <Bot className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{msg}</p>
            </div>
          ))}

          {/* If the modal is open and not all messages have been typed, show the typewriter */}
          {isOpen && !allMessagesTyped && messages.length > 0 ? (
            <div className="flex items-start gap-3">
              <Bot className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <p className="font-medium text-foreground">
                <Typewriter
                  key={`typing-${currentMessageIndex}`}
                  text={messages[currentMessageIndex]}
                  speed={30}
                  onComplete={handleMessageComplete}
                />
              </p>
            </div>
          ) : (
            /* Once all messages are typed, show a final loading indicator */
            <div className="flex items-start gap-3 text-primary">
              <Loader2 className="h-4 w-4 shrink-0 mt-0.5 animate-spin" />
              <p className="font-medium">Waiting for AI response...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
