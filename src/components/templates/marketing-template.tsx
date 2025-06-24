
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

export function MarketingTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    certifications,
    fontStyle,
    headingColor,
    bodyColor,
    accentColor,
  } = data;

  const rootStyle = {
  } as React.CSSProperties;

  const headerStyle = {
    backgroundColor: accentColor || '#111827',
    color: '#ffffff'
  }

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;

  const bodyStyle = {
    color: bodyColor || '#374151',
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
      className={cn('bg-white', fontClassMap[fontStyle] || 'font-inter')}
      style={rootStyle}
    >
      <header className="p-8 text-center" style={headerStyle}>
        {personalInfo.photo && <img src={personalInfo.photo} alt={personalInfo.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/50" />}
        <h1 className="text-4xl font-bold tracking-tight">{personalInfo?.name || 'Your Name'}</h1>
        <p className="text-lg mt-1 opacity-90">{experience[0]?.jobTitle || 'Marketing Professional'}</p>
      </header>

      <main className="p-8 grid grid-cols-3 gap-8" style={bodyStyle}>
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
            {summary && (
            <section>
                <h2 className="text-xl font-bold mb-3" style={headingStyle}>Professional Summary</h2>
                <p className="text-sm">{summary}</p>
            </section>
            )}
            
            {experience?.length > 0 && (
            <section>
                <h2 className="text-xl font-bold mb-4" style={headingStyle}>Experience</h2>
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
                        <span>{exp.company || 'Company'}{exp.location ? ` | ${exp.location}`: ''}</span>
                    </div>
                    <div className="mt-2">{renderDescription(exp.description)}</div>
                    </div>
                ))}
                </div>
            </section>
            )}
        </div>
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
            <section>
                <h2 className="text-xl font-bold mb-3" style={headingStyle}>Contact</h2>
                 <div className="space-y-2 text-sm">
                    {personalInfo?.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" /><span>{personalInfo.phone}</span></div>}
                    {personalInfo?.email && <div className="flex items-center gap-2"><AtSign size={14} className="shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
                    {personalInfo?.website && <div className="flex items-center gap-2"><Globe size={14} className="shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
                    {personalInfo?.location && <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /><span>{personalInfo.location}</span></div>}
                </div>
            </section>
            
            {skills?.length > 0 && (
            <section>
                <h2 className="text-xl font-bold mb-3" style={headingStyle}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span key={skill.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium" style={{color: headingColor}}>{skill.name}</span>
                    ))}
                </div>
            </section>
            )}

            {education?.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-3" style={headingStyle}>Education</h2>
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

            {certifications?.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-3" style={headingStyle}>Certifications</h2>
                    <div className="space-y-3">
                    {certifications.map((cert) => (
                        <div key={cert.id}>
                        <h3 className="font-semibold text-md">{cert.name}</h3>
                        <p className="text-sm">{cert.issuer}</p>
                        <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                    ))}
                    </div>
                </section>
            )}
        </div>
      </main>
    </div>
  );
}
