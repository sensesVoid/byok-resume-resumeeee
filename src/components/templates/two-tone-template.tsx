
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

export function TwoToneTemplate({ data }: TemplateProps) {
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

  const sidebarStyle = {
    backgroundColor: accentColor || '#e5e7eb', // A light gray
  } as React.CSSProperties;
  
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
      className={cn(
        'bg-white flex min-h-[1123px]',
        fontClassMap[fontStyle] || 'font-inter'
      )}
      style={rootStyle}
    >
      {/* Sidebar */}
      <div className="w-1/3 p-8 space-y-8" style={sidebarStyle}>
        <header className="text-left">
            {personalInfo?.photo && (
                <img src={personalInfo.photo} alt={personalInfo.name || ''} className="h-24 w-24 rounded-full object-cover mb-4" />
            )}
            <h1 className="text-3xl font-bold break-words" style={headingStyle}>
                {personalInfo?.name || 'Your Name'}
            </h1>
        </header>

        <div className="space-y-6">
          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2" style={headingStyle}>
              Contact
            </h2>
            <div className="space-y-2 text-xs" style={bodyStyle}>
              {personalInfo?.phone && <div className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0" /><span>{personalInfo.phone}</span></div>}
              {personalInfo?.email && <div className="flex items-start gap-2"><AtSign size={14} className="mt-0.5 shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
              {personalInfo?.website && <div className="flex items-start gap-2"><Globe size={14} className="mt-0.5 shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
              {personalInfo?.location && <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /><span>{personalInfo.location}</span></div>}
            </div>
          </section>

          {skills?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2" style={headingStyle}>
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
      </div>

      {/* Main content */}
      <div className="w-2/3 p-8 space-y-8" style={bodyStyle}>
        {summary && (
          <section>
            <h2 className="text-xl font-bold mb-2" style={headingStyle}>
              Summary
            </h2>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4" style={headingStyle}>
              Work Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <div className="text-sm font-medium shrink-0 whitespace-nowrap text-gray-500">
                      {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ' - Present'}
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

         {education?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3" style={headingStyle}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-md">{edu.degree}</h3>
                    <p className="text-sm">{edu.institution}, {edu.location}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        
        {certifications?.length > 0 && (
            <section>
                <h2 className="text-xl font-bold mb-3" style={headingStyle}>
                Certifications
                </h2>
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
    </div>
  );
}
