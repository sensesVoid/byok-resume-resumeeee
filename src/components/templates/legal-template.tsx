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

export function LegalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, fontStyle, headingColor, bodyColor, accentColor } = data;
  
  const rootStyle = {
    color: bodyColor || '#000000',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#000000',
  } as React.CSSProperties;

  const separatorStyle = {
    borderColor: accentColor,
  };

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc space-y-1.5 pl-6">
        {text.split('\n').map((line, index) => (
          line.trim() && <li key={index} className="text-sm leading-normal">{line.replace(/^-/, '').trim()}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className={cn("p-10 bg-white", fontClassMap[fontStyle] || 'font-merriweather')} style={rootStyle}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="mt-2 flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
          {personalInfo?.location && <span className="inline-flex items-center">{personalInfo.location}</span>}
          {personalInfo?.phone && <a href={`tel:${personalInfo.phone}`} className="inline-flex items-center hover:underline">{personalInfo.phone}</a>}
          {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center hover:underline break-all">{personalInfo.email}</a>}
        </div>
      </header>

      <hr className="my-6" style={separatorStyle} />

      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={headingStyle}>Objective</h2>
          <p className="text-sm">{summary}</p>
        </section>
      )}
      
      <div className="space-y-6">
        {experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={headingStyle}>Legal Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold">{exp.jobTitle || 'Job Title'}</h3>
                    <div className="text-sm font-normal shrink-0 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <div className="flex justify-between items-center text-sm italic">
                    <span>{exp.company || 'Firm or Company'}{exp.location ? `, ${exp.location}`: ''}</span>
                  </div>
                  <div className="mt-2">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        <hr className="my-6" style={separatorStyle} />

        {education?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={headingStyle}>Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                   <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold">{edu.degree || 'Degree'}</h3>
                    <div className="text-sm font-normal shrink-0 whitespace-nowrap">{edu.graduationDate}</div>
                  </div>
                   <p className="text-sm italic">{edu.institution || 'Institution'}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.description && <p className="mt-1 text-xs">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        
        <hr className="my-6" style={separatorStyle} />

        {skills?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={headingStyle}>Bar Admissions & Skills</h2>
            <p className="text-sm">
              {skills.map((skill) => skill.name).join('; ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
