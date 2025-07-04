
'use client';

import { type ResumeSchema } from '@/lib/schemas';
import { AtSign, Globe, MapPin, Phone } from 'lucide-react';
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

export function AcademicTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, projects, fontStyle, headingColor, bodyColor, accentColor } = data;
  
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
          line.trim() && <li key={index} className="text-sm leading-relaxed">{sanitize(line.replace(/^-/, '').trim())}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className={cn("p-8 bg-white", fontClassMap[fontStyle] || 'font-inter')} style={rootStyle}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={headingStyle}>{personalInfo?.name || 'Your Name'}</h1>
        <p className="text-lg" style={headingStyle}>Curriculum Vitae</p>
        <div className="mt-3 flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {personalInfo?.location && <span className="inline-flex items-center"><MapPin size={12} className="mr-1.5" />{personalInfo.location}</span>}
          {personalInfo?.phone && <a href={`tel:${personalInfo.phone}`} className="inline-flex items-center hover:underline"><Phone size={12} className="mr-1.5" />{personalInfo.phone}</a>}
          {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center hover:underline break-all"><AtSign size={12} className="mr-1.5" />{personalInfo.email}</a>}
          {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:underline break-all"><Globe size={12} className="mr-1.5" />{personalInfo.website}</a>}
        </div>
      </header>

      <div className="space-y-6">
        {summary && (
            <section>
                <h2 className="text-base font-semibold uppercase tracking-widest border-b pb-1 mb-2" style={headingWithAccentLineStyle}>Research Interests</h2>
                <p className="text-sm">{sanitize(summary)}</p>
            </section>
        )}
        
        {education?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-widest border-b pb-1 mb-2" style={headingWithAccentLineStyle}>Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">{edu.degree || 'Degree'}</h3>
                    <div className="text-sm font-normal text-gray-500 shrink-0 whitespace-nowrap">{edu.graduationDate}</div>
                  </div>
                   <p className="text-sm">{edu.institution || 'Institution'}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.description && <p className="mt-1 text-xs italic text-gray-600">{sanitize(edu.description)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-widest border-b pb-1 mb-2" style={headingWithAccentLineStyle}>Research Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">{exp.jobTitle || 'Position'}</h3>
                    <div className="text-sm font-normal text-gray-500 shrink-0 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="text-sm">{exp.company || 'Lab or Institution'}{exp.location ? `, ${exp.location}`: ''}</p>
                  <div className="mt-1">{renderDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-widest border-b pb-1 mb-2" style={headingWithAccentLineStyle}>Technical Skills</h2>
            <p className="text-sm leading-relaxed">
              {skills.map((skill) => skill.name).join('; ')}
            </p>
          </section>
        )}

        {certifications?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-widest border-b pb-1 mb-2" style={headingWithAccentLineStyle}>Certifications & Awards</h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                    <h3 className="text-md font-semibold">{cert.name}</h3>
                    <p className="text-sm">{cert.issuer}{cert.date ? ` - ${cert.date}` : ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects?.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-widest border-b pb-1 mb-2" style={headingWithAccentLineStyle}>Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-semibold">{project.name}</h3>
                      {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-normal text-gray-500 shrink-0 whitespace-nowrap hover:underline">View Project</a>}
                    </div>
                    <div className="mt-1">{renderDescription(project.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
