'use client';

import { type ResumeSchema } from '@/lib/schemas';
import {
  AtSign,
  Globe,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Star,
  User,
} from 'lucide-react';
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

export function ProfessionalTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    fontStyle,
    fontColor,
  } = data;

  const style = {
    fontFamily: fontMap[fontStyle] || fontMap.inter,
    color: fontColor || '#111827',
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
                  {line.replace(/^-/, '').trim()}
                </li>
              )
          )}
      </ul>
    );
  };

  return (
    <div
      className={cn(
        'p-0 bg-white flex',
        fontClassMap[fontStyle] || 'font-sans'
      )}
      style={style}
    >
      {/* Left Column (Sidebar) */}
      <div className="w-1/3 bg-gray-100 p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            {personalInfo?.name || 'Your Name'}
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b border-gray-300 pb-1">
              Contact
            </h2>
            <div className="space-y-2 text-xs">
              {personalInfo?.phone && (
                <div className="flex items-start gap-2">
                  <Phone size={14} className="mt-0.5 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo?.email && (
                <div className="flex items-start gap-2">
                  <AtSign size={14} className="mt-0.5 shrink-0" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-start gap-2">
                  <Globe size={14} className="mt-0.5 shrink-0" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {education?.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-md">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills?.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b border-gray-300 pb-1">
                Skills
              </h2>
              <div className="flex flex-col space-y-1 text-sm">
                {skills.map((skill) => (
                  <span key={skill.id}>{skill.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (Main content) */}
      <div className="w-2/3 p-8 space-y-8">
        {summary && (
          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <User size={20} /> Professional Summary
            </h2>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Briefcase size={20} /> Work Experience
            </h2>
            <div className="space-y-6 border-l-2 border-gray-200 pl-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-gray-300 border-4 border-white"></div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <div className="text-sm font-medium text-gray-500">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between text-md font-medium text-gray-700">
                    <span>{exp.company}</span>
                    <span className="text-sm text-gray-500">{exp.location}</span>
                  </div>
                  <div className="mt-2">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
