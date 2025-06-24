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
};

export function MinimalistTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    fontStyle,
    fontColor,
  } = data;

  const rootStyle = {
    fontFamily: fontMap[fontStyle] || fontMap.inter,
  } as React.CSSProperties;

  const headingStyle = {
    color: fontColor || '#111827',
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
                <li key={index} className="text-sm text-gray-600">
                  {line.replace(/^-/, '').trim()}
                </li>
              )
          )}
      </ul>
    );
  };

  return (
    <div
      className={cn('p-8 bg-white', fontClassMap[fontStyle] || 'font-sans')}
      style={rootStyle}
    >
      <header className="mb-8 text-left border-b pb-4">
        <h1 className="text-4xl font-bold" style={headingStyle}>
          {personalInfo?.name || 'Your Name'}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
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
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline"
            >
              <Globe size={12} className="mr-1.5" />
              {personalInfo.website}
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
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-500 mb-2" style={{ color: fontColor ? 'hsl(var(--muted-foreground))' : undefined }}>
              Summary
            </h2>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-500 mb-3" style={{ color: fontColor ? 'hsl(var(--muted-foreground))' : undefined }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">
                      {exp.jobTitle || 'Job Title'}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-medium text-gray-700">
                      {exp.company || 'Company'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {exp.location || 'Location'}
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
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-500 mb-3" style={{ color: fontColor ? 'hsl(var(--muted-foreground))' : undefined }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">
                      {edu.degree || 'Degree'}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {edu.graduationDate}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-medium text-gray-700">
                      {edu.institution || 'Institution'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {edu.location || 'Location'}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-xs italic text-gray-600">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-500 mb-3" style={{ color: fontColor ? 'hsl(var(--muted-foreground))' : undefined }}>
              Skills
            </h2>
            <p className="text-sm text-gray-700">
              {skills.map((skill) => skill.name).join(' · ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
