
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

export function ElegantTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, projects, fontStyle, headingColor, bodyColor, accentColor } = data;
  
  const rootStyle = {
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc space-y-1 pl-5">
        {text.split('\n').map((line, index) => (
          line.trim() && <li key={index} className="text-sm">{sanitize(line.replace(/^-/, '').trim())}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-inter')} style={rootStyle}>
      <header className="mb-8 border-b-2 pb-4" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-bold tracking-tight text-center" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="mt-3 flex justify-center flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
          {personalInfo?.location && <span className="inline-flex items-center"><MapPin size={12} className="mr-1.5" />{personalInfo.location}</span>}
          {personalInfo?.phone && <a href={`tel:${personalInfo.phone}`} className="inline-flex items-center hover:underline"><Phone size={12} className="mr-1.5" />{personalInfo.phone}</a>}
          {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center hover:underline break-all"><AtSign size={12} className="mr-1.5" />{personalInfo.email}</a>}
          {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:underline break-all"><Globe size={12} className="mr-1.5" />{personalInfo.website}</a>}
        </div>
      </header>

      {summary && (
        <section className="mb-8">
          <p className="text-center text-sm italic">{sanitize(summary)}</p>
        </section>
      )}
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
            {experience?.length > 0 && (
            <section>
                <h2 className="text-lg font-semibold uppercase tracking-wider mb-4" style={headingStyle}>Experience</h2>
                <div className="space-y-6">
                {experience.map((exp) => (
                    <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-md font-bold">{exp.jobTitle || 'Job Title'}</h3>
                        <div className="text-xs font-normal text-gray-500 shrink-0 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</div>
                    </div>
                    <div className="flex justify-between items-baseline text-sm">
                        <span className="font-semibold">{exp.company || 'Company'}{exp.location ? `, ${exp.location}`: ''}</span>
                    </div>
                    <div className="mt-2">{renderDescription(exp.description)}</div>
                    </div>
                ))}
                </div>
            </section>
            )}
            {projects?.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold uppercase tracking-wider mb-4" style={headingStyle}>Projects</h2>
                    <div className="space-y-6">
                    {projects.map((project) => (
                        <div key={project.id}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-bold">{project.name}</h3>
                            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs font-normal text-gray-500 shrink-0 whitespace-nowrap hover:underline">View Project</a>}
                        </div>
                        <div className="mt-2">{renderDescription(project.description)}</div>
                        </div>
                    ))}
                    </div>
                </section>
            )}
        </div>
        <div className="col-span-1 space-y-8">
            {education?.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold uppercase tracking-wider mb-4" style={headingStyle}>Education</h2>
                    <div className="space-y-4">
                    {education.map((edu) => (
                        <div key={edu.id}>
                        <h3 className="text-md font-bold">{edu.degree || 'Degree'}</h3>
                        <p className="text-sm font-semibold">{edu.institution || 'Institution'}</p>
                        <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                        {edu.description && <p className="mt-1 text-xs italic text-gray-600">{sanitize(edu.description)}</p>}
                        </div>
                    ))}
                    </div>
                </section>
            )}

            {skills?.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold uppercase tracking-wider mb-4" style={headingStyle}>Skills</h2>
                    <ul className="space-y-1">
                        {skills.map((skill) => (
                            <li key={skill.id} className="text-sm">{skill.name}</li>
                        ))}
                    </ul>
                </section>
            )}

            {certifications?.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold uppercase tracking-wider mb-4" style={headingStyle}>Certifications</h2>
                    <div className="space-y-3">
                    {certifications.map((cert) => (
                        <div key={cert.id}>
                            <h3 className="text-md font-bold">{cert.name}</h3>
                            <p className="text-sm font-semibold">{cert.issuer}</p>
                            <p className="text-xs text-gray-500">{cert.date}</p>
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
