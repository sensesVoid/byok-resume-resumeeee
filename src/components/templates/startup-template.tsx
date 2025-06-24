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

export function StartupTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    fontStyle,
    headingColor,
    bodyColor,
    accentColor,
  } = data;

  const rootStyle = {
    fontFamily: fontMap[fontStyle] || fontMap.inter,
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;
  
  const accentBgStyle = {
    backgroundColor: accentColor,
  }

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc space-y-1 pl-4">
        {text
          .split('\n')
          .map(
            (line, index) =>
              line.trim() && (
                <li key={index} className="text-sm">
                  {line.replace(/^-/, '').trim()}
                </li>
              )
          )}
      </ul>
    );
  };

  return (
    <div
      className={cn('p-8 bg-white', fontClassMap[fontStyle] || 'font-sans')}
      style={rootStyle}
    >
      <header className="mb-8 text-left">
        <h1 className="text-5xl font-extrabold tracking-tighter" style={headingStyle}>
          {personalInfo?.name || 'Your Name'}
        </h1>
        <p className="text-lg mt-1" style={{ color: headingColor, opacity: 0.8 }}>{experience[0]?.jobTitle || 'Passionate Professional'}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-1.5 hover:underline"><AtSign size={14} />{personalInfo.email}</a>}
          {personalInfo?.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</span>}
          {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline"><Globe size={14} />{personalInfo.website}</a>}
          {personalInfo?.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</span>}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
             {summary && (
            <section>
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={headingStyle}>About</h2>
                <p className="text-sm">{summary}</p>
            </section>
            )}
             {experience?.length > 0 && (
            <section>
                <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={headingStyle}>Experience</h2>
                <div className="space-y-6">
                {experience.map((exp, index) => (
                    <div key={exp.id} className="relative pl-6">
                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full" style={{...accentBgStyle, opacity: 1 - (index * 0.2)}}></div>
                        <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                        <div className="text-xs font-medium text-gray-500 shrink-0 whitespace-nowrap">
                            {exp.startDate} - {exp.endDate || 'Present'}
                        </div>
                        </div>
                        <div className="text-md font-medium text-gray-600">
                        <span>{exp.company || 'Company'}{exp.location ? ` | ${exp.location}`: ''}</span>
                        </div>
                        <div className="mt-2">{renderDescription(exp.description)}</div>
                    </div>
                ))}
                </div>
            </section>
            )}
        </div>
        <div className="md:col-span-1 space-y-8">
             {skills?.length > 0 && (
            <section>
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={headingStyle}>Skills</h2>
                 <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                        <span key={skill.id} className="rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium">{skill.name}</span>
                    ))}
                </div>
            </section>
            )}
             {education?.length > 0 && (
            <section>
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={headingStyle}>Education</h2>
                <div className="space-y-3">
                {education.map((edu) => (
                    <div key={edu.id}>
                    <h3 className="font-semibold text-md">{edu.degree}</h3>
                    <p className="text-sm">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                    </div>
                ))}
                </div>
            </section>
            )}
        </div>
      </div>
    </div>
  );
}
