
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

export function GeometricTemplate({ data }: TemplateProps) {
    const { personalInfo, summary, experience, education, skills, certifications, projects, fontStyle, headingColor, bodyColor, accentColor } = data;

    const rootStyle = {
      color: bodyColor || '#374151',
    } as React.CSSProperties;

    const headingStyle = {
      color: headingColor || '#111827',
    } as React.CSSProperties;

    const headerStyle = {
      backgroundColor: accentColor || '#f9fafb', // Use accentColor for the header
    } as React.CSSProperties;

    const renderDescription = (text?: string) => {
        if (!text) return null;
        return (
          <ul className="list-none space-y-1 pl-4">
            {text.split('\n').map((line, index) => (
              line.trim() && (
                <li key={index} className="relative pl-4 text-sm">
                    <span className="absolute left-0 top-2 h-1 w-1 bg-current rounded-full" style={headingStyle}></span>
                    {sanitize(line.replace(/^-/, '').trim())}
                </li>
              )
            ))}
          </ul>
        );
      };

    return (
        <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-inter')} style={rootStyle}>
            <header className="relative mb-8 text-left p-6" style={headerStyle}>
                <div className="absolute top-0 right-0 h-16 w-16 opacity-20" style={{ backgroundColor: headingColor || 'hsl(var(--primary))' }}></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tighter" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-1.5 hover:text-primary"><AtSign size={14} />{personalInfo.email}</a>}
                        {personalInfo?.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</span>}
                        {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary"><Globe size={14} />{personalInfo.website}</a>}
                        {personalInfo?.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</span>}
                    </div>
                </div>
            </header>
            
            <main className="space-y-8">
                {summary && (
                    <section>
                        <p className="text-sm text-center border-y py-4" style={{ borderColor: headingColor }}>{sanitize(summary)}</p>
                    </section>
                )}
                
                {experience?.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold" style={headingStyle}>
                        <span className="h-3 w-3 rotate-45" style={{ backgroundColor: headingColor || 'hsl(var(--primary))' }}></span>
                        Work Experience
                    </h2>
                    <div className="space-y-6">
                    {experience.map((exp) => (
                        <div key={exp.id}>
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-lg font-semibold">{exp.jobTitle || 'Job Title'}</h3>
                            <div className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</div>
                        </div>
                        <div className="flex items-baseline justify-between text-md font-medium text-gray-600">
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
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold" style={headingStyle}>
                        <span className="h-3 w-3 rotate-45" style={{ backgroundColor: headingColor || 'hsl(var(--primary))' }}></span>
                        Education
                    </h2>
                    <div className="space-y-4">
                    {education.map((edu) => (
                        <div key={edu.id}>
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-lg font-semibold">{edu.degree || 'Degree'}</h3>
                            <div className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap">{edu.graduationDate}</div>
                        </div>
                        <div className="flex items-baseline justify-between text-md font-medium text-gray-600">
                            <span>{edu.institution || 'Institution'}{edu.location ? `, ${edu.location}`: ''}</span>
                        </div>
                        {edu.description && <p className="mt-1 text-sm">{sanitize(edu.description)}</p>}
                        </div>
                    ))}
                    </div>
                </section>
                )}

                {skills?.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold" style={headingStyle}>
                        <span className="h-3 w-3 rotate-45" style={{ backgroundColor: headingColor || 'hsl(var(--primary))' }}></span>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span key={skill.id} className="rounded-sm bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">{skill.name}</span>
                    ))}
                    </div>
                </section>
                )}

                {certifications?.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold" style={headingStyle}>
                        <span className="h-3 w-3 rotate-45" style={{ backgroundColor: headingColor || 'hsl(var(--primary))' }}></span>
                        Certifications
                    </h2>
                    <div className="space-y-3">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="pl-4">
                            <h3 className="text-lg font-semibold">{cert.name}</h3>
                            <p className="text-md font-medium text-gray-600">{cert.issuer}{cert.date ? ` - ${cert.date}` : ''}</p>
                        </div>
                    ))}
                    </div>
                </section>
                )}

                {projects?.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold" style={headingStyle}>
                        <span className="h-3 w-3 rotate-45" style={{ backgroundColor: headingColor || 'hsl(var(--primary))' }}></span>
                        Projects
                    </h2>
                    <div className="space-y-6">
                    {projects.map((project) => (
                        <div key={project.id}>
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap hover:underline">View Project</a>}
                        </div>
                        <div className="mt-2">{renderDescription(project.description)}</div>
                        </div>
                    ))}
                    </div>
                </section>
                )}
            </main>
        </div>
    );
}
