'use client';

import type { ResumeSchema } from '@/lib/schemas';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import {
  AtSign,
  Briefcase,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type * as React from 'react';

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

const EditableField = ({
  name,
  placeholder,
  className,
  as = 'input',
}: {
  name: any;
  placeholder: string;
  className?: string;
  as?: 'input' | 'textarea';
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (as === 'textarea') {
          return (
            <textarea
              placeholder={placeholder}
              className={cn('inline-edit-textarea', className)}
              {...field}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                // Important: Update form state before calculating height
                field.onChange(e);
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          );
        }
        return (
          <input
            placeholder={placeholder}
            className={cn('inline-edit-input', className)}
            {...field}
          />
        );
      }}
    />
  );
};

export function DiyTemplate({ data }: { data: ResumeSchema }) {
  const { control, watch } = useFormContext<ResumeSchema>();
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'skills' });
  const [newSkill, setNewSkill] = useState('');

  const {
    fontStyle,
    headingColor,
    bodyColor,
  } = data;

  const rootStyle = {
    fontFamily: fontMap[fontStyle] || fontMap.inter,
    color: bodyColor || '#374151',
  } as React.CSSProperties;

  const headingStyle = {
    color: headingColor || '#111827',
  } as React.CSSProperties;


  const handleAddSkill = () => {
    if (newSkill.trim()) {
      appendSkill({ id: crypto.randomUUID(), name: newSkill.trim() });
      setNewSkill('');
    }
  };

  return (
    <div 
      className={cn("p-6 sm:p-8 bg-white", fontClassMap[fontStyle] || 'font-sans')}
      style={rootStyle}
    >
      <header className="text-center">
        <div style={headingStyle}>
          <EditableField
            name="personalInfo.name"
            placeholder="Your Name"
            className="text-4xl font-bold tracking-tight text-center"
          />
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <AtSign size={14} />
            <EditableField name="personalInfo.email" placeholder="Email" />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone size={14} />
            <EditableField name="personalInfo.phone" placeholder="Phone" />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe size={14} />
            <EditableField
              name="personalInfo.website"
              placeholder="Website"
            />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} />
            <EditableField
              name="personalInfo.location"
              placeholder="Location"
            />
          </span>
        </div>
      </header>

      <section className="mt-8">
        <EditableField
          name="summary"
          as="textarea"
          placeholder="Your professional summary..."
          className="text-center text-sm"
        />
      </section>

      <Separator className="my-6 bg-gray-200" />

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}>
            <Briefcase size={20} /> Work Experience
          </h2>
          <div className="space-y-6">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 right-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="flex items-baseline justify-between">
                  <EditableField
                    name={`experience.${index}.jobTitle`}
                    placeholder="Job Title"
                    className="text-lg font-semibold"
                  />
                  <div className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap flex gap-1 items-center">
                    <EditableField
                      name={`experience.${index}.startDate`}
                      placeholder="Start"
                      className="w-24 text-right"
                    />
                    <span>-</span>
                    <EditableField
                      name={`experience.${index}.endDate`}
                      placeholder="End"
                      className="w-24"
                    />

                  </div>
                </div>
                <div className="flex items-baseline justify-between text-md font-medium text-gray-600">
                  <EditableField
                    name={`experience.${index}.company`}
                    placeholder="Company"
                  />
                </div>
                <div className="mt-2">
                  <EditableField
                    name={`experience.${index}.description`}
                    placeholder="Describe your role and achievements..."
                    as="textarea"
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                appendExperience({
                  id: crypto.randomUUID(),
                  jobTitle: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  location: '',
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}>
            <GraduationCap size={20} /> Education
          </h2>
          <div className="space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 right-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="flex items-baseline justify-between">
                  <EditableField
                    name={`education.${index}.degree`}
                    placeholder="Degree"
                    className="text-lg font-semibold"
                  />
                  <EditableField
                    name={`education.${index}.graduationDate`}
                    placeholder="Date"
                    className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap w-24 text-right"
                  />
                </div>
                <div className="flex items-baseline justify-between text-md font-medium text-gray-600">
                  <EditableField
                    name={`education.${index}.institution`}
                    placeholder="Institution"
                  />
                </div>
                <EditableField
                  name={`education.${index}.description`}
                  placeholder="Additional details..."
                  as="textarea"
                  className="mt-1 text-sm"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                appendEducation({
                  id: crypto.randomUUID(),
                  degree: '',
                  institution: '',
                  graduationDate: '',
                  description: '',
                  location: '',
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}>
            <Star size={20} /> Skills
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {skillFields.map((field, index) => (
              <div
                key={field.id}
                className="group flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
              >
                <span>{watch(`skills.${index}.name`)}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-gray-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="New skill"
                className="h-8"
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddSkill())
                }
              />
              <Button size="sm" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
