'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type * as React from 'react';

interface TemplateProps {
    data: ResumeSchema;
}

const fontMap: { [key: string]: string } = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  lato: "'Lato', sans-serif",
  merriweather: "'Merriweather', serif",
};

const fontClassMap: { [key: string]: string } = {
  inter: 'font-sans',
  roboto: 'font-sans',
  lato: 'font-sans',
  merriweather: 'font-serif',
}

export function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, fontStyle, headingColor, bodyColor } = data;
  
  const rootStyle = {
    fontFamily: fontMap[fontStyle] || fontMap.inter,
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
          line.trim() && <li key={index} className="text-sm">{line.replace(/^-/, '').trim()}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-sans')} style={rootStyle}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wider uppercase" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="mt-2 flex justify-center flex-wrap gap-x-6 text-xs text-gray-500">
          {personalInfo?.location && <span className="inline-flex items-center"><MapPin size={12} className="mr-1.5" />{personalInfo.location}</span>}
          {personalInfo?.phone && <a href={`tel:${personalInfo.phone}`} className="inline-flex items-center hover:underline"><Phone size={12} className="mr-1.5" />{personalInfo.phone}</a>}
          {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center hover:underline break-all"><AtSign size={12} className="mr-1.5" />{personalInfo.email}</a>}
          {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:underline break-all"><Globe size={12} className="mr-1.5" />{personalInfo.website}</a>}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-center border-b-2 border-current pb-1 mb-2" style={headingStyle}>Summary</h2>
          <p className="text-sm text-center">{summary}</p>
        </section>
      )}
      
      <div className="space-y-6">
        {experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-current pb-1 mb-2" style={headingStyle}>Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-bold">{exp.jobTitle || 'Job Title'}</h3>
                    <div className="text-xs font-normal text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-semibold">{exp.company || 'Company'}</span>
                    {exp.location && <span className="text-xs text-gray-500">{exp.location}</span>}
                  </div>
                  <div className="mt-1">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-current pb-1 mb-2" style={headingStyle}>Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-bold">{edu.degree || 'Degree'}</h3>
                    <div className="text-xs font-normal text-gray-500">{edu.graduationDate}</div>
                  </div>
                   <div className="flex justify-between items-baseline text-sm">
                    <span className="font-semibold">{edu.institution || 'Institution'}</span>
                    {edu.location && <span className="text-xs text-gray-500">{edu.location}</span>}
                  </div>
                  {edu.description && <p className="mt-1 text-xs italic text-gray-600">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-current pb-1 mb-2" style={headingStyle}>Skills</h2>
            <p className="text-sm">
              {skills.map((skill) => skill.name).join(' | ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
