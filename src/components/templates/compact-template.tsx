
'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { cn, sanitize } from '@/lib/utils';
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

export function CompactTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    certifications,
    projects,
    fontStyle,
    headingColor,
    bodyColor,
    accentColor
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
      <ul className="list-disc space-y-0.5 pl-4">
        {text
          .split('\n')
          .map(
            (line, index) =>
              line.trim() && (
                <li key={index} className="text-xs">
                  {sanitize(line.replace(/^-/, '').trim())}
                </li>
              )
          )}
      </ul>
    );
  };

  return (
    <div
      className={cn('p-6 bg-white text-xs', fontClassMap[fontStyle] || 'font-inter')}
      style={rootStyle}
    >
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold" style={headingStyle}>
          {personalInfo?.name || 'Your Name'}
        </h1>
        <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center hover:underline"
            >
              <AtSign size={10} className="mr-1" />
              {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && (
            <a
              href={`tel:${personalInfo.phone}`}
              className="inline-flex items-center hover:underline"
            >
              <Phone size={10} className="mr-1" />
              {personalInfo.phone}
            </a>
          )}
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline"
            >
              <Globe size={10} className="mr-1" />
              {personalInfo.website}
            </a>
          )}
          {personalInfo?.location && (
            <span className="inline-flex items-center">
              <MapPin size={10} className="mr-1" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </header>

      <div className="space-y-3">
        {summary && (
          <section>
            <p className="text-xs italic">{sanitize(summary)}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b" style={{...headingStyle, borderColor: accentColor}}>
              Experience
            </h2>
            <div className="space-y-2 mt-1.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold">
                      {exp.jobTitle || 'Job Title'}
                    </h3>
                    <div className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-medium">
                      {exp.company || 'Company'}
                       {exp.location && <span className="text-gray-500"> | {exp.location}</span>}
                    </span>
                  </div>
                  <div className="mt-1">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b" style={{...headingStyle, borderColor: accentColor}}>
              Education
            </h2>
            <div className="space-y-2 mt-1.5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold">
                      {edu.degree || 'Degree'}
                    </h3>
                    <div className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                      {edu.graduationDate}
                    </div>
                  </div>
                   <p className="text-xs font-medium">{edu.institution || 'Institution'}{edu.location ? ` | ${edu.location}` : ''}</p>
                   {edu.description && <p className="text-xs italic text-gray-600">{sanitize(edu.description)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b" style={{...headingStyle, borderColor: accentColor}}>
              Skills
            </h2>
            <p className="text-xs mt-1.5">
              {skills.map((skill) => skill.name).join(' | ')}
            </p>
          </section>
        )}

        {certifications?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b" style={{...headingStyle, borderColor: accentColor}}>
              Certifications
            </h2>
            <div className="space-y-2 mt-1.5">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="text-sm font-semibold">{cert.name}</h3>
                  <p className="text-xs font-medium">{cert.issuer}{cert.date ? ` | ${cert.date}` : ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b" style={{...headingStyle, borderColor: accentColor}}>
              Projects
            </h2>
            <div className="space-y-2 mt-1.5">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold">{project.name}</h3>
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 shrink-0 whitespace-nowrap hover:underline">View</a>}
                  </div>
                  <div className="mt-1">{renderDescription(project.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
