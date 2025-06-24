'use client';

import {
  FileDown,
  Loader2,
  Upload,
  ScanSearch,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
  onUploadClick: () => void;
  isUploading: boolean;
  onCalculateAtsScore: (type: 'resume' | 'cover-letter') => void;
  isCalculatingAts: boolean;
  isAiPowered: boolean;
  onDownloadResume: () => void;
  onDownloadCoverLetter: () => void;
  isCoverLetterEmpty: boolean;
  isDownloading: boolean;
}

export function AppHeader({
  onUploadClick,
  isUploading,
  onCalculateAtsScore,
  isCalculatingAts,
  isAiPowered,
  onDownloadResume,
  onDownloadCoverLetter,
  isCoverLetterEmpty,
  isDownloading,
}: AppHeaderProps) {
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
            disabled={isUploading || isDownloading || isCalculatingAts}
            variant="outline"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            <span className="ml-2 hidden sm:inline">Upload Resume</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isDownloading || isUploading || isCalculatingAts}>
              {isDownloading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FileDown />
              )}
              <span className="ml-2 hidden sm:inline">Download PDF</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onDownloadResume}>
              Download Resume
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDownloadCoverLetter}
              disabled={isCoverLetterEmpty}
            >
              Download Cover Letter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={
                !isAiPowered || isCalculatingAts || isDownloading || isUploading
              }
            >
              {isCalculatingAts ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ScanSearch />
              )}
              <span className="ml-2 hidden sm:inline">Calculate ATS</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onCalculateAtsScore('resume')}>
              For Resume
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCalculateAtsScore('cover-letter')}
              disabled={isCoverLetterEmpty}
            >
              For Cover Letter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
