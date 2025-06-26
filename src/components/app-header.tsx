'use client';

import {
  Loader2,
  Upload,
  ScanSearch,
  ChevronDown,
  HelpCircle,
  Gift,
  Eye,
  Save,
  MoreVertical,
  Trash2,
  Brush,
  FileText,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

interface AppHeaderProps {
  onUploadClick: () => void;
  isUploading: boolean;
  onCalculateAtsScore: (type: 'resume' | 'cover-letter') => void;
  isCalculatingAts: boolean;
  isAiPowered: boolean;
  onPreviewClick: (type: 'resume' | 'cover-letter') => void;
  isCoverLetterEmpty: boolean;
  isDonationEnabled: boolean;
  onAboutClick: () => void;
  onDonateClick: () => void;
  onSaveClick: () => void;
  isSaving: boolean;
  onDeleteClick: () => void;
}

export function AppHeader({
  onUploadClick,
  isUploading,
  onCalculateAtsScore,
  isCalculatingAts,
  isAiPowered,
  onPreviewClick,
  isCoverLetterEmpty,
  isDonationEnabled,
  onAboutClick,
  onDonateClick,
  onSaveClick,
  isSaving,
  onDeleteClick,
}: AppHeaderProps) {
  const { setTheme } = useTheme();

  // Social Share Logic
  const shareUrl = 'https://resumeeee.app';
  const shareText =
    "Just created my professional resume with Resumeeee! It’s an amazing free tool with AI suggestions, ATS scoring, and sleek templates. Highly recommend it if you're on the job hunt. Check it out! #ResumeBuilder #AI #JobSearch #Career";
  const shareTitle = 'Resumeeee: The AI-Powered Resume Builder';

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    shareUrl
  )}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(
    shareText
  )}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

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
            disabled={isUploading || isCalculatingAts || isSaving}
            variant="outline"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            <span className="ml-2 hidden sm:inline">Upload Resume</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isUploading || isCalculatingAts || isSaving}>
              <Eye />
              <span className="ml-2 hidden sm:inline">Preview</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onPreviewClick('resume')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Preview Resume</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPreviewClick('cover-letter')}
              disabled={isCoverLetterEmpty}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Preview Cover Letter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={
                !isAiPowered || isCalculatingAts || isUploading || isSaving
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Share App"
              disabled={isUploading || isCalculatingAts || isSaving}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on X
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on LinkedIn
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on Facebook
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isDonationEnabled && (
          <Button
            onClick={onDonateClick}
            variant="ghost"
            size="icon"
            aria-label="Donate"
            disabled={isUploading || isCalculatingAts || isSaving}
          >
            <Gift className="h-5 w-5" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="More options"
              disabled={isUploading || isCalculatingAts}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSaveClick} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              <span>Save Progress</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Brush className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDeleteClick}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete All Data</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
