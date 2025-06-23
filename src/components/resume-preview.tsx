'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AtSign, Globe, MapPin, Phone, Briefcase, GraduationCap, Star, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ResumePreview() {
  const { control } = useFormContext<ResumeSchema>();
  const data = useWatch({ control });
  const { personalInfo, summary, experience, education, skills, coverLetter } = data;

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc space-y-1 pl-4">
        {text.split('\n').map((line, index) => (
          line.trim() && <li key={index} className="text-sm text-gray-700">{line.replace(/^-/, '').trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="h-full w-full overflow-hidden shadow-lg print:shadow-none print:border-none">
      <CardContent className="h-full p-0">
        <Tabs defaultValue="resume" className="flex h-full flex-col">
          <TabsList className="mx-4 mt-4 shrink-0 print:hidden">
            <TabsTrigger value="resume"><FileText className="mr-2 h-4 w-4" /> Resume</TabsTrigger>
            <TabsTrigger value="cover-letter"><FileText className="mr-2 h-4 w-4" /> Cover Letter</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto">
            <div id="printable-area" className="bg-white text-gray-900">
              <TabsContent value="resume" className="m-0">
                <div className="p-6 sm:p-8">
                  <header className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">{personalInfo?.name || 'Your Name'}</h1>
                    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary"><AtSign size={14} />{personalInfo.email}</a>}
                      {personalInfo?.phone && <span className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</span>}
                      {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary"><Globe size={14} />{personalInfo.website}</a>}
                      {personalInfo?.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</span>}
                    </div>
                  </header>

                  {summary && (
                    <section className="mt-8">
                      <p className="text-center text-sm">{summary}</p>
                    </section>
                  )}

                  <Separator className="my-6" />
                  
                  <div className="space-y-8">
                    {experience?.length > 0 && (
                      <section>
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-accent"><Briefcase size={20} /> Work Experience</h2>
                        <div className="space-y-6">
                          {experience.map((exp) => (
                            <div key={exp.id}>
                              <div className="flex items-baseline justify-between">
                                <h3 className="text-lg font-semibold">{exp.jobTitle || 'Job Title'}</h3>
                                <div className="text-sm font-medium text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</div>
                              </div>
                              <div className="flex items-baseline justify-between text-md font-medium text-gray-600">
                                <span>{exp.company || 'Company'}</span>
                                <span className="text-sm">{exp.location || 'Location'}</span>
                              </div>
                              <div className="mt-2">{renderDescription(exp.description)}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {education?.length > 0 && (
                      <section>
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-accent"><GraduationCap size={20} /> Education</h2>
                        <div className="space-y-4">
                          {education.map((edu) => (
                            <div key={edu.id}>
                               <div className="flex items-baseline justify-between">
                                <h3 className="text-lg font-semibold">{edu.degree || 'Degree'}</h3>
                                <div className="text-sm font-medium text-gray-500">{edu.graduationDate}</div>
                              </div>
                               <div className="flex items-baseline justify-between text-md font-medium text-gray-600">
                                <span>{edu.institution || 'Institution'}</span>
                                <span className="text-sm">{edu.location || 'Location'}</span>
                              </div>
                              {edu.description && <p className="mt-1 text-sm text-gray-700">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {skills?.length > 0 && (
                      <section>
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-accent"><Star size={20} /> Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <span key={skill.id} className="rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{skill.name}</span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="cover-letter" className="m-0">
                <div className="p-6 sm:p-8">
                  {coverLetter ? (
                     <div className="prose prose-sm max-w-full">
                       <pre className="whitespace-pre-wrap font-body text-sm">{coverLetter}</pre>
                     </div>
                  ) : (
                    <div className="flex h-96 items-center justify-center text-center text-gray-500">
                      <div className="space-y-2">
                        <FileText size={48} className="mx-auto" />
                        <p>Your generated cover letter will appear here.</p>
                        <p className="text-xs">Go to the "AI Cover Letter Generator" section to create one.</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
