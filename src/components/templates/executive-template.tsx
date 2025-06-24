
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

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, fontStyle, headingColor, bodyColor, accentColor } = data;
  
  const rootStyle = {
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;

  const headingWithAccentLineStyle = {
    ...headingStyle,
    borderBottomColor: accentColor,
  };

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
    <div className={cn("p-10 bg-white", fontClassMap[fontStyle] || 'font-merriweather')} style={rootStyle}>
      <header className="mb-10">
        <div className="flex items-center gap-8 justify-center">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.name}
              className="w-28 h-28 rounded-full object-cover shrink-0"
            />
          )}
          <div className="text-center flex-grow">
            <h1
              className="text-4xl font-bold tracking-wider uppercase"
              style={headingStyle}
            >
              {personalInfo?.name || 'Your Name'}
            </h1>
            <div className="mt-3 flex justify-center flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              {personalInfo?.location && (
                <span className="inline-flex items-center">
                  <MapPin size={12} className="mr-1.5" />
                  {personalInfo.location}
                </span>
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
              {personalInfo?.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center hover:underline break-all"
                >
                  <AtSign size={12} className="mr-1.5" />
                  {personalInfo.email}
                </a>
              )}
              {personalInfo?.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:underline break-all"
                >
                  <Globe size={12} className="mr-1.5" />
                  {personalInfo.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center mb-3" style={headingStyle}>Executive Summary</h2>
          <p className="text-sm text-center max-w-3xl mx-auto">{summary}</p>
        </section>
      )}
      
      <div className="space-y-8">
        {experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 pb-2 mb-4" style={headingWithAccentLineStyle}>Professional Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-bold">{exp.jobTitle || 'Job Title'}</h3>
                    <div className="text-xs font-normal text-gray-500 shrink-0 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <div className="flex justify-between items-baseline text-md">
                    <span className="font-semibold">{exp.company || 'Company'}{exp.location ? `, ${exp.location}`: ''}</span>
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
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 pb-2 mb-4" style={headingWithAccentLineStyle}>Education</h2>
                <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id}>
                    <h3 className="text-md font-bold">{edu.degree || 'Degree'}</h3>
                    <p className="text-sm">{edu.institution || 'Institution'}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                    {edu.description && <p className="mt-1 text-xs italic text-gray-600">{edu.description}</p>}
                    </div>
                ))}
                </div>
            </section>
            )}

            {skills?.length > 0 && (
            <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 pb-2 mb-4" style={headingWithAccentLineStyle}>Core Competencies</h2>
                <ul className="columns-2 space-y-1 text-sm">
                {skills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                ))}
                </ul>
            </section>
            )}
        </div>

        {certifications?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 pb-2 mb-4" style={headingWithAccentLineStyle}>Certifications</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-bold">{cert.name}</h3>
                  <p>{cert.issuer}{cert.date ? ` - ${cert.date}` : ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
