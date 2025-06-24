'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
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
};

export function TechnicalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, fontStyle, fontColor } = data;

  const style = {
    fontFamily: fontMap[fontStyle] || fontMap.inter,
    color: fontColor || '#111827',
  } as React.CSSProperties;

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
        <div className="prose prose-sm max-w-none text-gray-700">
            <ul>
                {text.split('\n').map((line, index) => (
                    line.trim() && <li key={index}>{line.replace(/^-/, '').trim()}</li>
                ))}
            </ul>
        </div>
    );
  };
  
  return (
    <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-sans')} style={style}>
      <header className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold">{personalInfo?.name || 'Your Name'}</h1>
        <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-500">
            {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2">About</h2>
            <p className="text-sm">{summary}</p>
        </section>
      )}
      
      <div className="space-y-6">
        {experience?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-3">Experience</h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="text-md font-semibold">{exp.jobTitle || 'Job Title'}</h3>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>{exp.company || 'Company'} / {exp.location || 'Location'}</span>
                    <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="mt-1">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-md font-semibold">{edu.degree || 'Degree'}</h3>
                   <div className="text-sm text-gray-600 flex justify-between">
                    <span>{edu.institution || 'Institution'} / {edu.location || 'Location'}</span>
                    <span>{edu.graduationDate}</span>
                  </div>
                  {edu.description && <p className="mt-1 text-sm italic text-gray-500">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm">{skill.name}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
