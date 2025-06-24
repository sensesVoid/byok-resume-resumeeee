
'use client';

import {
  FileDown,
  Loader2,
  Upload,
  ScanSearch,
  ChevronDown,
  HelpCircle,
  Gift,
  Eye,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';

interface AppHeaderProps {
  onUploadClick: () => void;
  isUploading: boolean;
  onCalculateAtsScore: (type: 'resume' | 'cover-letter') => void;
  isCalculatingAts: boolean;
  isAiPowered: boolean;
  onDownloadResume: () => void;
  onDownloadCoverLetter: () => void;
  onPreviewClick: (type: 'resume' | 'cover-letter') => void;
  isCoverLetterEmpty: boolean;
  isDownloading: boolean;
  isDonationEnabled: boolean;
  onAboutClick: () => void;
  onDonateClick: () => void;
  onSaveClick: () => void;
  isSaving: boolean;
}

export function AppHeader({
  onUploadClick,
  isUploading,
  onCalculateAtsScore,
  isCalculatingAts,
  isAiPowered,
  onDownloadResume,
  onDownloadCoverLetter,
  onPreviewClick,
  isCoverLetterEmpty,
  isDownloading,
  isDonationEnabled,
  onAboutClick,
  onDonateClick,
  onSaveClick,
  isSaving,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-8 print:hidden">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Resumeeee</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onAboutClick}
          variant="ghost"
          size="icon"
          aria-label="About"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        {isAiPowered && (
          <Button
            onClick={onUploadClick}
            disabled={isUploading || isDownloading || isCalculatingAts || isSaving}
            variant="outline"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            <span className="ml-2 hidden sm:inline">Upload Resume</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isDownloading || isUploading || isCalculatingAts || isSaving}>
              {isDownloading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FileDown />
              )}
              <span className="ml-2 hidden sm:inline">Download</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onPreviewClick('resume')}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview Resume</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadResume}>
              <FileDown className="mr-2 h-4 w-4" />
              <span>Download Resume</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onPreviewClick('cover-letter')}
              disabled={isCoverLetterEmpty}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview Cover Letter</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDownloadCoverLetter}
              disabled={isCoverLetterEmpty}
            >
              <FileDown className="mr-2 h-4 w-4" />
              <span>Download Cover Letter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={
                !isAiPowered || isCalculatingAts || isDownloading || isUploading || isSaving
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

        {isDonationEnabled && (
          <Button
            onClick={onDonateClick}
            variant="outline"
            disabled={isDownloading || isUploading || isCalculatingAts || isSaving}
          >
            <Gift className="mr-2 h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Donate</span>
          </Button>
        )}
        <Button
          onClick={onSaveClick}
          disabled={isSaving || isDownloading || isUploading || isCalculatingAts}
          variant="ghost"
          size="icon"
          aria-label="Save progress"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
