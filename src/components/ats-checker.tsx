'use client';

import { useState, useTransition } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ScanSearch, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateAtsScoreAction } from '@/app/actions';
import type { CalculateAtsScoreOutput } from '@/ai/flows/calculate-ats-score';
import type { ResumeSchema } from '@/lib/schemas';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function AtsChecker() {
  const { getValues } = useFormContext<ResumeSchema>();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [atsResult, setAtsResult] = useState<CalculateAtsScoreOutput | null>(null);

  const handleCalculateAtsScore = () => {
    const { personalInfo, summary, experience, education, skills, jobDescription, aiConfig } = getValues();
    
    if (!jobDescription) {
      toast({
        variant: 'destructive',
        title: 'Job Description Missing',
        description: 'Please provide a job description to calculate the ATS score.',
      });
      return;
    }

    const resumeText = `
      Name: ${personalInfo.name}
      Email: ${personalInfo.email}
      ${personalInfo.phone ? `Phone: ${personalInfo.phone}`: ''}
      ${personalInfo.website ? `Website: ${personalInfo.website}`: ''}
      ${personalInfo.location ? `Location: ${personalInfo.location}`: ''}

      Summary: ${summary}

      Experience:
      ${experience.map(exp => `
        - ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
          ${exp.location ? `, ${exp.location}`: ''}
          Description: ${exp.description}
      `).join('\n')}

      Education:
      ${education.map(edu => `
        - ${edu.degree} from ${edu.institution} (Graduated: ${edu.graduationDate})
          ${edu.location ? `, ${edu.location}`: ''}
          ${edu.description ? `Details: ${edu.description}`: ''}
      `).join('\n')}

      Skills: ${skills.map(s => s.name).join(', ')}
    `;

    startTransition(async () => {
      try {
        setAtsResult(null);
        const result = await calculateAtsScoreAction({ resumeText, jobDescription, aiConfig });
        setAtsResult(result);
        toast({
          title: 'Success!',
          description: 'Your ATS score has been calculated.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (error as Error).message,
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Analyze your resume against a job description to see how well it matches and get suggestions for improvement.
      </p>
      <Button onClick={handleCalculateAtsScore} disabled={isPending}>
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
        Calculate ATS Score
      </Button>

      {isPending && (
         <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <CardTitle>Analyzing your resume...</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This may take a few moments. We're comparing your resume against the job description to calculate your ATS score.</p>
                <Skeleton className="w-full h-8 mt-4" />
                <Skeleton className="w-2/3 h-4 mt-2" />
            </CardContent>
         </Card>
      )}

      {atsResult && (
        <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your ATS Score</CardTitle>
                    <CardDescription>This score estimates how well your resume matches the job description.</CardDescription>
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
                            {atsResult.score > 85 ? "Excellent match!" : atsResult.score > 70 ? "Good match, but could be improved." : "Needs improvement to pass ATS screening."}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Keyword & Formatting Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Keyword Analysis</h4>
                        <p className="text-sm text-muted-foreground">{atsResult.keywordAnalysis}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Formatting Feedback</h4>
                        <p className="text-sm text-muted-foreground">{atsResult.formattingFeedback}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Missing Skills & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                    {atsResult.missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {atsResult.missingSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Great job! We didn't find any major skills missing from your resume based on the job description.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}