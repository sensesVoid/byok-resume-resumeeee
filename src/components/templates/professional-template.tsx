
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

export function ProfessionalTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    certifications,
    fontStyle,
    headingColor,
    bodyColor,
    accentColor,
  } = data;

  const rootStyle = {
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;

  const sidebarStyle = {
    backgroundColor: accentColor || '#f3f4f6',
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
        fontClassMap[fontStyle] || 'font-inter'
      )}
      style={rootStyle}
    >
      {/* Left Column (Sidebar) */}
      <div className="w-1/3 p-8 space-y-8" style={sidebarStyle}>
        <div className="flex flex-col items-center text-center space-y-4">
            {personalInfo?.photo && (
                <img src={personalInfo.photo} alt={personalInfo.name || ''} className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" />
            )}
            <h1 className="text-3xl font-bold break-words" style={headingStyle}>
                {personalInfo?.name || 'Your Name'}
            </h1>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b pb-1" style={{...headingStyle, borderColor: bodyColor}}>
              Contact
            </h2>
            <div className="space-y-2 text-xs" style={{color: bodyColor}}>
              {personalInfo?.phone && (
                <div className="flex items-start gap-2">
                  <Phone size={14} className="mt-0.5 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo?.email && (
                <div className="flex items-start gap-2">
                  <AtSign size={14} className="mt-0.5 shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-start gap-2">
                  <Globe size={14} className="mt-0.5 shrink-0" />
                  <span className="break-all">{personalInfo.website}</span>
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
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b pb-1" style={{...headingStyle, borderColor: bodyColor}}>
                Education
              </h2>
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
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b pb-1" style={{...headingStyle, borderColor: bodyColor}}>
                Skills
              </h2>
              <div className="flex flex-col space-y-1 text-sm">
                {skills.map((skill) => (
                  <span key={skill.id}>{skill.name}</span>
                ))}
              </div>
            </div>
          )}

          {certifications?.length > 0 && (
              <div>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2 border-b pb-1" style={{...headingStyle, borderColor: bodyColor}}>
                  Certifications
              </h2>
              <div className="space-y-2">
                  {certifications.map((cert) => (
                  <div key={cert.id}>
                      <h3 className="font-semibold text-md">{cert.name}</h3>
                      <p className="text-xs" style={{color: bodyColor}}>{cert.issuer}{cert.date ? ` (${cert.date})` : ''}</p>
                  </div>
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
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2" style={headingStyle}>
              <User size={20} /> Professional Summary
            </h2>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={headingStyle}>
              <Briefcase size={20} /> Work Experience
            </h2>
            <div className="space-y-6 border-l-2 pl-6" style={{ borderColor: accentColor }}>
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white" style={{ backgroundColor: accentColor }}></div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <div className="text-sm font-medium shrink-0 whitespace-nowrap" style={{color: bodyColor}}>
                      {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ' - Present'}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between text-md font-medium">
                    <span style={{color: bodyColor}}>{exp.company || 'Company'}{exp.location ? `, ${exp.location}`: ''}</span>
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
