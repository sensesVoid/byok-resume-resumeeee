
'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone, Briefcase, GraduationCap, Star, KanbanSquare } from 'lucide-react';
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

export function CreativeTemplate({ data }: TemplateProps) {
    const { personalInfo, summary, experience, education, skills, certifications, projects, fontStyle, headingColor, bodyColor } = data;

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
            {text.split('\n').map((line, index) => (
              line.trim() && <li key={index} className="text-sm">{sanitize(line.replace(/^-/, '').trim())}</li>
            ))}
          </ul>
        );
      };

    return (
        <div className={cn("p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-8", fontClassMap[fontStyle] || 'font-inter')} style={rootStyle}>
            {/* Left Column */}
            <div className="md:col-span-1 space-y-8">
                <div className="text-center">
                     {personalInfo?.photo && (
                        <div className="flex justify-center mb-4">
                            <img src={personalInfo.photo} alt={personalInfo.name || ''} className="h-28 w-28 rounded-full object-cover border-4 border-gray-200 shadow-lg" />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold break-words" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
                    <p className="text-md mt-1" style={{ color: bodyColor }}>Aspiring to be great</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <h2 className="font-bold uppercase tracking-wider text-sm mb-2" style={headingStyle}>Contact</h2>
                        <div className="space-y-1 text-sm">
                            {personalInfo?.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" /><span>{personalInfo.phone}</span></div>}
                            {personalInfo?.email && <div className="flex items-center gap-2"><AtSign size={14} className="shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
                            {personalInfo?.website && <div className="flex items-center gap-2"><Globe size={14} className="shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
                            {personalInfo?.location && <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /><span>{personalInfo.location}</span></div>}
                        </div>
                    </div>
                    
                    {education?.length > 0 && (
                        <div>
                            <h2 className="font-bold uppercase tracking-wider text-sm mb-2" style={headingStyle}>Education</h2>
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-semibold text-md">{edu.degree}</h3>
                                        <p className="text-sm" style={{color: bodyColor}}>{edu.institution}</p>
                                        <p className="text-xs" style={{color: bodyColor}}>{edu.graduationDate}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills?.length > 0 && (
                        <div>
                             <h2 className="font-bold uppercase tracking-wider text-sm mb-2" style={headingStyle}>Skills</h2>
                             <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span key={skill.id} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">{skill.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {certifications?.length > 0 && (
                        <div>
                            <h2 className="font-bold uppercase tracking-wider text-sm mb-2" style={headingStyle}>Certifications</h2>
                            <div className="space-y-3">
                                {certifications.map((cert) => (
                                    <div key={cert.id}>
                                        <h3 className="font-semibold text-md">{cert.name}</h3>
                                        <p className="text-sm" style={{color: bodyColor}}>{cert.issuer}</p>
                                        <p className="text-xs" style={{color: bodyColor}}>{cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 space-y-8">
                {summary && (
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={headingStyle}><Star size={20} /> Professional Summary</h2>
                        <p className="text-sm">{sanitize(summary)}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={headingStyle}><Briefcase size={20} /> Work Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                                        <div className="text-sm font-medium shrink-0 whitespace-nowrap" style={{color: bodyColor}}>{exp.startDate} - {exp.endDate || 'Present'}</div>
                                    </div>
                                    <div className="flex items-baseline justify-between text-md font-medium">
                                        <span className="text-gray-800">{exp.company || 'Company'}{exp.location ? `, ${exp.location}`: ''}</span>
                                    </div>
                                    <div className="mt-2">{renderDescription(exp.description)}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects?.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={headingStyle}><KanbanSquare size={20} /> Projects</h2>
                        <div className="space-y-6">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="text-lg font-semibold">{project.name}</h3>
                                        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium shrink-0 whitespace-nowrap hover:underline" style={{color: bodyColor}}>View Project</a>}
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
