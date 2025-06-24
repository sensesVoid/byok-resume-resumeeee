'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type * as React from 'react';

interface TemplateProps {
  data: ResumeSchema;
}

const fontClassMap: { [key: string]: string } = {
  inter: 'font-inter',
  roboto: 'font-roboto',
  lato: 'font-lato',
  merriweather: 'font-merriweather',
  montserrat: 'font-montserrat',
  'roboto-slab': 'font-roboto-slab',
  'playfair-display': 'font-playfair-display',
  'source-sans-pro': 'font-source-sans-pro',
};

export function CorporateTemplate({ data }: TemplateProps) {
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
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;

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
      className={cn('p-8 bg-white flex gap-8', fontClassMap[fontStyle] || 'font-inter')}
      style={rootStyle}
    >
      {/* Left Column */}
      <div className="w-1/3 flex-shrink-0 space-y-6">
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{...headingStyle, borderColor: accentColor}}>
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {personalInfo?.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" /><span>{personalInfo.phone}</span></div>}
            {personalInfo?.email && <div className="flex items-center gap-2"><AtSign size={14} className="shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
            {personalInfo?.website && <div className="flex items-center gap-2"><Globe size={14} className="shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
            {personalInfo?.location && <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /><span>{personalInfo.location}</span></div>}
          </div>
        </section>

        {education?.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{...headingStyle, borderColor: accentColor}}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-md">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  {edu.description && <p className="text-xs text-gray-500 italic mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
             <h2 className="text-base font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{...headingStyle, borderColor: accentColor}}>
               Skills
             </h2>
             <ul className="space-y-1 text-sm">
                {skills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div className="w-2/3 space-y-6">
        <header className="text-left">
          <h1 className="text-4xl font-bold tracking-tight" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
        </header>

        {summary && (
          <section>
            <h2 className="text-xl font-bold border-b-2 pb-1 mb-3" style={{...headingStyle, borderColor: accentColor}}>Professional Profile</h2>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold border-b-2 pb-1 mb-3" style={{...headingStyle, borderColor: accentColor}}>Work Experience</h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <div className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div className="text-md font-medium text-gray-600">
                    <span>{exp.company || 'Company'}{exp.location ? `, ${exp.location}`: ''}</span>
                  </div>
                  <div className="mt-2">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
