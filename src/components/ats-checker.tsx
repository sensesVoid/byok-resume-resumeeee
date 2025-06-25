
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, AlertTriangle, Plus } from 'lucide-react';
import type { CalculateAtsScoreOutput } from '@/ai/flows/calculate-ats-score';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';

interface AtsCheckerProps {
  atsResult: CalculateAtsScoreOutput | null;
  documentType: 'resume' | 'cover-letter';
  onAddMissingSkills?: (skills: string[]) => void;
}

export function AtsChecker({
  atsResult,
  documentType,
  onAddMissingSkills,
}: AtsCheckerProps) {
  if (!atsResult) {
    return (
      <Card className="flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
          <p className="font-semibold">Analysis Failed</p>
          <p className="text-sm">
            Could not retrieve ATS score. Please try again.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Your ATS Score</CardTitle>
          <CardDescription>
            This score estimates how well your {documentType} matches the job
            description.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative h-24 w-24 shrink-0">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="text-muted/20"
                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-primary"
                strokeDasharray={`${atsResult.score}, 100`}
                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{atsResult.score}</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <Progress value={atsResult.score} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground">
              {atsResult.score > 85
                ? 'Excellent match!'
                : atsResult.score > 70
                ? 'Good match, but could be improved.'
                : 'Needs improvement to pass ATS screening.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Keyword & Formatting Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Keyword Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {atsResult.keywordAnalysis}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Formatting Feedback</h4>
            <p className="text-sm text-muted-foreground">
              {atsResult.formattingFeedback}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Missing Skills
            & Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atsResult.missingSkills.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {atsResult.missingSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              {onAddMissingSkills && documentType === 'resume' && (
                <div className="pt-2">
                  <Button
                    onClick={() => onAddMissingSkills(atsResult.missingSkills)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Missing Skills to Resume
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Great job! We didn't find any major skills missing from your{' '}
              {documentType} based on the job description.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
