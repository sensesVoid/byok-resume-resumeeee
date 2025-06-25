
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    if (isOpen) {
      setCurrentMessageIndex(0);
      setCompletedMessages([]);
    }
  }, [isOpen, messages]);

  const handleMessageComplete = useCallback(() => {
    // This callback is now stable. It uses the length of the completed messages
    // array to determine the next message, avoiding a dependency on the rapidly
    // changing currentMessageIndex state, which was causing the render loop.
    setCompletedMessages(prev => [...prev, messages[prev.length]]);
    setCurrentMessageIndex(prev => prev + 1);
  }, [messages]);

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
          {/* Display all the messages that have finished typing */}
          {completedMessages.map((msg, index) => (
            <div
              key={index}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <Bot className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{msg}</p>
            </div>
          ))}

          {/* If the modal is open and not all messages have been typed, show the typewriter */}
          {isOpen && !allMessagesTyped ? (
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
