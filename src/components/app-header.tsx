'use client';

import { FileDown, Loader2, Upload, ScanSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useState, useEffect } from 'react';

interface AppHeaderProps {
  onUploadClick: () => void;
  isUploading: boolean;
  onCalculateAtsScore: () => void;
  isCalculatingAts: boolean;
  isAiPowered: boolean;
}

export function AppHeader({ 
  onUploadClick, 
  isUploading,
  onCalculateAtsScore,
  isCalculatingAts,
  isAiPowered 
}: AppHeaderProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    // Timeout to allow state to update before print dialog opens
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-8 print:hidden">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Resumeeee</h1>
      </div>
      <div className="flex items-center gap-2">
        {isAiPowered && (
          <Button
            onClick={onUploadClick}
            disabled={isUploading || isPrinting || isCalculatingAts}
            variant="outline"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            <span className="ml-2 hidden sm:inline">Upload Resume</span>
          </Button>
        )}
        <Button onClick={handlePrint} disabled={isPrinting || isUploading || isCalculatingAts}>
          {isPrinting ? <Loader2 className="animate-spin" /> : <FileDown />}
          <span className="ml-2 hidden sm:inline">Download PDF</span>
        </Button>
        <Button 
          onClick={onCalculateAtsScore}
          disabled={!isAiPowered || isCalculatingAts || isPrinting || isUploading}
        >
          {isCalculatingAts ? <Loader2 className="animate-spin" /> : <ScanSearch />}
           <span className="ml-2 hidden sm:inline">Calculate ATS</span>
        </Button>
      </div>
    </header>
  );
}
