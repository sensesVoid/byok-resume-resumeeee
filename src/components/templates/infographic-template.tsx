'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone, Briefcase, GraduationCap, Star, User } from 'lucide-react';
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

export function InfographicTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, fontStyle, headingColor, bodyColor, accentColor } = data;
  
  const rootStyle = {
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;
  
  const accentTextStyle = {
    color: accentColor,
  };

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc space-y-1 pl-4">
        {text.split('\n').map((line, index) => (
          line.trim() && <li key={index} className="text-sm">{line.replace(/^-/, '').trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-inter')} style={rootStyle}>
      <header className="flex items-center gap-6 mb-8">
        {personalInfo.photo && <img src={personalInfo.photo} alt={personalInfo.name} className="w-28 h-28 rounded-full object-cover" />}
        <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-1.5 hover:underline"><AtSign size={14} style={accentTextStyle} />{personalInfo.email}</a>}
                {personalInfo?.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} style={accentTextStyle} />{personalInfo.phone}</span>}
                {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline"><Globe size={14} style={accentTextStyle} />{personalInfo.website}</a>}
                {personalInfo?.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} style={accentTextStyle} />{personalInfo.location}</span>}
            </div>
        </div>
      </header>

      <div className="space-y-8">
        {summary && (
            <section>
                <h2 className="flex items-center gap-2 text-xl font-bold mb-3" style={headingStyle}><User style={accentTextStyle} /> About Me</h2>
                <p className="text-sm border-l-4 pl-4" style={{borderColor: accentColor}}>{summary}</p>
            </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4" style={headingStyle}><Briefcase style={accentTextStyle} /> Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="pl-6 relative">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white" style={{backgroundColor: accentColor}}></div>
                  <div className="absolute left-[7px] top-5 h-full w-px bg-gray-200"></div>
                  
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle || 'Job Title'}</h3>
                    <div className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</div>
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
        
        <div className="grid grid-cols-2 gap-8">
            {education?.length > 0 && (
            <section>
                <h2 className="flex items-center gap-2 text-xl font-bold mb-4" style={headingStyle}><GraduationCap style={accentTextStyle} /> Education</h2>
                <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id}>
                    <h3 className="text-lg font-semibold">{edu.degree || 'Degree'}</h3>
                    <p className="text-md font-medium text-gray-600">{edu.institution || 'Institution'}</p>
                    <p className="text-sm text-gray-500">{edu.graduationDate}</p>
                    {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                    </div>
                ))}
                </div>
            </section>
            )}

            {skills?.length > 0 && (
            <section>
                <h2 className="flex items-center gap-2 text-xl font-bold mb-4" style={headingStyle}><Star style={accentTextStyle} /> Skills</h2>
                <div className="space-y-2">
                {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-32 shrink-0">{skill.name}</span>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${Math.floor(Math.random() * 50) + 50}%`, backgroundColor: accentColor }}></div>
                        </div>
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
