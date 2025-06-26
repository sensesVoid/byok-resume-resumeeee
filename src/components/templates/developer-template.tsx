
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

export function DeveloperTemplate({ data }: TemplateProps) {
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
    accentColor,
  } = data;

  const rootStyle = {
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const sidebarStyle = {
    backgroundColor: accentColor || '#1a202c',
    color: '#e2e8f0', // A light color for text on dark background
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
                  {sanitize(line.replace(/^-/, '').trim())}
                </li>
              )
          )}
      </ul>
    );
  };

  return (
    <div
      className={cn(
        'bg-white flex',
        fontClassMap[fontStyle] || 'font-inter'
      )}
      style={rootStyle}
    >
      {/* Sidebar */}
      <div className="w-1/3 p-6 space-y-8" style={sidebarStyle}>
        <div>
          <h1 className="text-3xl font-bold font-mono text-white break-words">{personalInfo?.name || 'Your Name'}</h1>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2 text-gray-400">
              Contact
            </h2>
            <div className="space-y-2 text-xs">
              {personalInfo?.phone && <div className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0" /><span>{personalInfo.phone}</span></div>}
              {personalInfo?.email && <div className="flex items-start gap-2"><AtSign size={14} className="mt-0.5 shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
              {personalInfo?.website && <div className="flex items-start gap-2"><Globe size={14} className="mt-0.5 shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
              {personalInfo?.location && <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /><span>{personalInfo.location}</span></div>}
            </div>
          </section>

          {skills?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 text-gray-400">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {skills.map((skill) => (
                  <span key={skill.id} className="rounded-md bg-gray-600/50 px-2 py-1 font-mono">{skill.name}</span>
                ))}
              </div>
            </section>
          )}

           {education?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 text-gray-400">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-md text-white">{edu.degree}</h3>
                    <p className="text-sm">{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications?.length > 0 && (
            <section>
                <h2 className="font-bold uppercase tracking-wider text-sm mb-2 text-gray-400">
                Certifications
                </h2>
                <div className="space-y-3">
                {certifications.map((cert) => (
                    <div key={cert.id}>
                    <h3 className="font-semibold text-md text-white">{cert.name}</h3>
                    <p className="text-sm">{cert.issuer}</p>
                    <p className="text-xs text-gray-400">{cert.date}</p>
                    </div>
                ))}
                </div>
            </section>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="w-2/3 p-8 space-y-8">
        {summary && (
          <section>
            <h2 className="text-xl font-bold text-gray-500 mb-2 font-mono" style={headingStyle}>
              &gt; Professional_Summary
            </h2>
            <p className="text-sm">{sanitize(summary)}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-500 mb-4 font-mono" style={headingStyle}>
              &gt; Work_Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <div className="text-sm font-mono shrink-0 whitespace-nowrap text-gray-500">
                      {exp.startDate}{exp.endDate ? `..${exp.endDate}` : '..Present'}
                    </div>
                  </div>
                  <div className="text-md font-medium text-gray-600">
                    <span>{exp.company || 'Company'}{exp.location ? ` // ${exp.location}`: ''}</span>
                  </div>
                  <div className="mt-2">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-500 mb-4 font-mono" style={headingStyle}>
              &gt; Personal_Projects
            </h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-mono shrink-0 whitespace-nowrap text-gray-500 hover:underline">
                            [view_link]
                        </a>
                    )}
                  </div>
                  <div className="mt-2">{renderDescription(project.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
