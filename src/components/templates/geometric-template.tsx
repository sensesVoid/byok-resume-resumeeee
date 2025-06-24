'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone, Briefcase, GraduationCap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type * as React from 'react';

interface TemplateProps {
    data: ResumeSchema;
}

const fontMap: { [key: string]: string } = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  lato: "'Lato', sans-serif",
  merriweather: "'Merriweather', serif",
};

const fontClassMap: { [key: string]: string } = {
  inter: 'font-sans',
  roboto: 'font-sans',
  lato: 'font-sans',
  merriweather: 'font-serif',
}

export function GeometricTemplate({ data }: TemplateProps) {
    const { personalInfo, summary, experience, education, skills, fontStyle, fontColor } = data;

    const style = {
      fontFamily: fontMap[fontStyle] || fontMap.inter,
      color: fontColor || '#111827',
      '--primary-color': 'hsl(var(--primary))',
    } as React.CSSProperties;

    const renderDescription = (text?: string) => {
        if (!text) return null;
        return (
          <ul className="list-none space-y-1 pl-4">
            {text.split('\n').map((line, index) => (
              line.trim() && (
                <li key={index} className="relative pl-4 text-sm text-gray-700">
                    <span className="absolute left-0 top-2 h-1 w-1 bg-current rounded-full"></span>
                    {line.replace(/^-/, '').trim()}
                </li>
              )
            ))}
          </ul>
        );
      };

    return (
        <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-sans')} style={style}>
            <header className="relative mb-8 text-left p-6 bg-gray-50">
                <div className="absolute top-0 right-0 h-16 w-16 bg-primary opacity-20"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tighter">{personalInfo?.name || 'Your Name'}</h1>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary"><AtSign size={14} />{personalInfo.email}</a>}
                        {personalInfo?.phone && <span className="flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</span>}
                        {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary"><Globe size={14} />{personalInfo.website}</a>}
                        {personalInfo?.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</span>}
                    </div>
                </div>
            </header>
            
            <main className="space-y-8">
                {summary && (
                    <section>
                        <p className="text-sm text-center border-y border-gray-200 py-4 text-gray-700">{summary}</p>
                    </section>
                )}
                
                {experience?.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
                        <span className="h-3 w-3 bg-primary rotate-45"></span>
                        Work Experience
                    </h2>
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
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
                        <span className="h-3 w-3 bg-primary rotate-45"></span>
                        Education
                    </h2>
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
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
                        <span className="h-3 w-3 bg-primary rotate-45"></span>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span key={skill.id} className="rounded-sm bg-gray-100 px-3 py-1 text-sm font-medium">{skill.name}</span>
                    ))}
                    </div>
                </section>
                )}
            </main>
        </div>
    );
}
