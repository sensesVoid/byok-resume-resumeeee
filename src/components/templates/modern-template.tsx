
'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { Separator } from '@/components/ui/separator';
import { AtSign, Globe, MapPin, Phone, Briefcase, GraduationCap, Star, Award } from 'lucide-react';
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

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, fontStyle, headingColor, bodyColor, accentColor } = data;

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
          line.trim() && <li key={index} className="text-sm">{line.replace(/^-/, '').trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className={cn("p-6 sm:p-8 bg-white", fontClassMap[fontStyle] || 'font-inter')} style={rootStyle}>
      <header className="text-center flex flex-col items-center">
        {personalInfo?.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}
        <h1 className="text-4xl font-bold tracking-tight" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-500">
          {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-1.5 hover:text-primary"><AtSign size={14} />{personalInfo.email}</a>}
          {personalInfo?.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{personalInfo.phone}</span>}
          {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary"><Globe size={14} />{personalInfo.website}</a>}
          {personalInfo?.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{personalInfo.location}</span>}
        </div>
      </header>

      {summary && (
        <section className="mt-8">
          <p className="text-center text-sm">{summary}</p>
        </section>
      )}

      <Separator className="my-6" style={{ backgroundColor: accentColor }} />
      
      <div className="space-y-8">
        {experience?.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}><Briefcase size={20} /> Work Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{exp.jobTitle || 'Job Title'}</h3>
                    <div className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</div>
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
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}><GraduationCap size={20} /> Education</h2>
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
                  {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}><Star size={20} /> Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">{skill.name}</span>
              ))}
            </div>
          </section>
        )}

        {certifications?.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}><Award size={20} /> Certifications</h2>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="text-lg font-semibold">{cert.name}</h3>
                  <p className="text-md font-medium text-gray-600">{cert.issuer}{cert.date ? ` - ${cert.date}`: ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
