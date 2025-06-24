'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone, Award } from 'lucide-react';
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

export function MedicalTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    fontStyle,
    headingColor,
    bodyColor,
    accentColor
  } = data;

  const rootStyle = {
    color: bodyColor || '#333333',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#1E40AF', // A professional blue
  } as React.CSSProperties;

  const renderDescription = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc space-y-1 pl-5">
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
      className={cn('p-8 bg-white', fontClassMap[fontStyle] || 'font-lato')}
      style={rootStyle}
    >
      <header className="mb-6 text-center border-b-2 pb-4" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold" style={headingStyle}>
          {personalInfo?.name || 'Your Name'}
        </h1>
         <p className="text-lg font-medium text-gray-600">{experience[0]?.jobTitle || 'Medical Professional'}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center hover:underline"
            >
              <AtSign size={12} className="mr-1.5" />
              {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && (
            <a
              href={`tel:${personalInfo.phone}`}
              className="inline-flex items-center hover:underline"
            >
              <Phone size={12} className="mr-1.5" />
              {personalInfo.phone}
            </a>
          )}
          {personalInfo?.location && (
            <span className="inline-flex items-center">
              <MapPin size={12} className="mr-1.5" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {summary && (
          <section>
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-600 mb-2" style={headingStyle}>
              Professional Summary
            </h2>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-600 mb-3" style={headingStyle}>
              Clinical Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">
                      {exp.jobTitle || 'Job Title'}
                    </h3>
                    <div className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-medium">
                      {exp.company || 'Hospital or Clinic'}
                       {exp.location && <span className="text-gray-500 ml-2">{exp.location}</span>}
                    </span>
                  </div>
                  <div className="mt-2">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-600 mb-3" style={headingStyle}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">
                      {edu.degree || 'Degree'}
                    </h3>
                    <div className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                      {edu.graduationDate}
                    </div>
                  </div>
                   <p className="font-medium text-sm">{edu.institution || 'Institution'}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.description && <p className="mt-1 text-xs italic text-gray-600">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-600 mb-3" style={headingStyle}>
              Licenses & Certifications
            </h2>
             <ul className="space-y-1 text-sm">
                {skills.map((skill) => (
                    <li key={skill.id} className="flex items-center gap-2">
                        <Award size={14} className="text-gray-500" />
                        <span>{skill.name}</span>
                    </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
