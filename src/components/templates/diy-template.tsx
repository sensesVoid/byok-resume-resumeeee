
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
  User,
  Upload,
  Square,
  Slash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import type * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';

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
  const { control, trigger } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const autoResize = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  useEffect(() => {
    if (as === 'textarea' && elementRef.current) {
        autoResize(elementRef.current as HTMLTextAreaElement);
    }
  }, [as, isEditing]);


  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            field.onChange(e);
            if (as === 'textarea') {
                autoResize(e.target as HTMLTextAreaElement);
            }
        };

        if (as === 'textarea') {
          return (
            <textarea
              ref={elementRef as React.Ref<HTMLTextAreaElement>}
              placeholder={placeholder}
              className={cn('inline-edit-textarea', className)}
              {...field}
              onInput={handleInput}
              rows={1}
            />
          );
        }
        return (
          <input
            ref={elementRef as React.Ref<HTMLInputElement>}
            placeholder={placeholder}
            className={cn('inline-edit-input', className)}
            {...field}
          />
        );
      }}
    />
  );
};


const DraggableResizableItem = ({
  path,
  children,
  className,
  onRemove,
  isPhoto = false,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  isPhoto?: boolean;
}) => {
  const { watch, setValue, trigger } = useFormContext<ResumeSchema>();
  const itemData = watch(path as any); // Using 'as any' here because path is dynamic
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Only drag with left mouse button, and not on interactive elements
    const isInteractive = target.dataset.interactive === 'true' || target.closest('[data-interactive="true"]');
    if (e.button !== 0 || isInteractive || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }
    
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = itemData.x;
    const initialY = itemData.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setValue(`${path}.x` as any, initialX + dx, { shouldValidate: false });
      setValue(`${path}.y` as any, initialY + dy, { shouldValidate: false });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      trigger(path as any);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = itemRef.current?.offsetWidth || 0;
    const startHeight = itemRef.current?.offsetHeight || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth < 50) newWidth = 50;
      setValue(`${path}.width` as any, newWidth, { shouldValidate: false });
      
      if (!isPhoto) { // Photos are square, height is derived from width
        let newHeight = startHeight + (moveEvent.clientY - startY);
        if (newHeight < 20) newHeight = 20;
        setValue(`${path}.height` as any, newHeight, { shouldValidate: false });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      trigger(path as any);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={itemRef}
      onMouseDown={handleMouseDown}
      className={cn(
        "group absolute p-2",
        isDragging ? "cursor-grabbing z-10" : "cursor-grab",
        className
      )}
      style={{
        left: `${itemData?.x ?? 0}px`,
        top: `${itemData?.y ?? 0}px`,
        width: itemData?.width ? `${itemData.width}px` : 'auto',
        height: isPhoto && itemData?.width ? `${itemData.width}px` : (itemData?.height ? `${itemData.height}px` : 'auto'),
      }}
    >
      <div className={cn(
        "absolute inset-0 border-2 border-dashed border-transparent transition-colors pointer-events-none",
         isDragging ? "border-primary/50" : "group-hover:border-primary/50"
      )} />
      {children}
      {onRemove && (
         <Button
            data-interactive="true"
            variant="ghost"
            size="icon"
            className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
            aria-label="Remove element"
        >
            <Trash2 className="h-3 w-3" />
        </Button>
      )}
      <div
        data-interactive="true"
        className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-white cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

const DiyToolbar = ({ onAddElement }: { onAddElement: (type: 'line' | 'rectangle') => void }) => {
    return (
      <div className="absolute top-4 left-4 z-20 flex gap-2 rounded-lg bg-background p-2 shadow-md border" data-interactive="true">
        <Button variant="ghost" size="icon" onClick={() => onAddElement('rectangle')} aria-label="Add rectangle">
          <Square className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onAddElement('line')} aria-label="Add line">
          <Slash className="h-5 w-5" />
        </Button>
      </div>
    );
};


export function DiyTemplate({ data }: { data: ResumeSchema }) {
  const { control, watch, setValue } = useFormContext<ResumeSchema>();
  const { toast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [isFileDragging, setIsFileDragging] = useState(false);

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
  const {
    fields: decorationFields,
    append: appendDecoration,
    remove: removeDecoration,
  } = useFieldArray({ control, name: 'decorations' });
  const [newSkill, setNewSkill] = useState('');

  const {
    fontStyle,
    headingColor,
    bodyColor,
    accentColor,
    personalInfo,
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
  
  const handleFile = (file: File | null | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload an image file (e.g., PNG, JPG).',
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
            toast({
                variant: 'destructive',
                title: 'Error Reading File',
                description: 'Could not read the selected file.',
            });
            return;
        }
        setValue('personalInfo.photo', dataUrl, { shouldValidate: true });
        toast({
            title: 'Photo Uploaded!',
            description: 'Your photo has been added to the resume.',
        });
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error reading file',
            description: 'Could not read the content from the selected file.',
        });
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    if (event.target) {
        event.target.value = '';
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragging(false);

    const isFileDrop = e.dataTransfer.files && e.dataTransfer.files.length > 0;
    if (isFileDrop) {
      handleFile(e.dataTransfer.files[0]);
    } else if (isPhotoDragging) {
      // This is a component drop, not a file drop
      const dropZoneRect = dropZoneRef.current!.getBoundingClientRect();
      const newX = e.clientX - dropZoneRect.left - (personalInfo.photoX ? 64 : 0); // half width approx
      const newY = e.clientY - dropZoneRect.top - (personalInfo.photoY ? 64 : 0); // half height approx
      setValue('personalInfo.photoX', newX, { shouldValidate: true });
      setValue('personalInfo.photoY', newY, { shouldValidate: true });
    }
    setIsPhotoDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setIsPhotoDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0 && e.dataTransfer.types.includes('Files')) {
      setIsFileDragging(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if the relatedTarget is outside the dropzone
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFileDragging(false);
    }
  };
  
  const handleAddElement = (type: 'line' | 'rectangle') => {
    appendDecoration({
      id: crypto.randomUUID(),
      type,
      x: 50,
      y: 50,
      width: 200,
      height: type === 'line' ? 2 : 100, // Line height is stroke-width
      color: headingColor,
    });
  };

  return (
    <div 
      ref={dropZoneRef}
      className={cn(
        "p-6 sm:p-8 bg-white relative min-h-[1123px] transition-all", 
        fontClassMap[fontStyle] || 'font-sans',
        isFileDragging && "ring-4 ring-primary ring-offset-2"
        )}
      style={rootStyle}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <DiyToolbar onAddElement={handleAddElement} />
      
      {/* Decorations rendered first to be in the background */}
      {decorationFields.map((field, index) => {
        const path = `decorations.${index}`;
        const decoration = watch(path as any);
        return (
          <DraggableResizableItem key={field.id} path={path} onRemove={() => removeDecoration(index)}>
            {decoration.type === 'rectangle' ? (
                <div className="w-full h-full" style={{ backgroundColor: decoration.color }} />
            ) : (
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" style={{ stroke: decoration.color, strokeWidth: decoration.height }} />
                </svg>
            )}
          </DraggableResizableItem>
        )
      })}

      <DraggableResizableItem path="diyLayout.photo" isPhoto={true}>
          <div
            className="relative w-full h-full rounded-full"
            data-interactive="true"
            >
            <Avatar className="h-full w-full pointer-events-none">
                <AvatarImage src={watch('personalInfo.photo') || undefined} alt={watch('personalInfo.name') || 'User photo'} />
                <AvatarFallback className="h-full w-full">
                    <User className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-default">
                <Button type="button" size="icon" onClick={() => photoInputRef.current?.click()} aria-label="Upload photo">
                    <Upload className="h-5 w-5" />
                </Button>
                {watch('personalInfo.photo') && (
                    <Button type="button" size="icon" variant="destructive" onClick={() => setValue('personalInfo.photo', '', { shouldValidate: true })} aria-label="Remove photo">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                )}
            </div>
          </div>
      </DraggableResizableItem>
      <input
          type="file"
          ref={photoInputRef}
          onChange={handlePhotoUpload}
          accept="image/png, image/jpeg"
          className="hidden"
          data-interactive="true"
      />

      <DraggableResizableItem path="diyLayout.header">
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
      </DraggableResizableItem>

      <DraggableResizableItem path="diyLayout.summary">
        <section>
          <EditableField
            name="summary"
            as="textarea"
            placeholder="Your professional summary..."
            className="text-center text-sm"
          />
        </section>
      </DraggableResizableItem>

      <DraggableResizableItem path="diyLayout.experience">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}>
            <Briefcase size={20} /> Work Experience
          </h2>
          <div className="space-y-6">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="group relative">
                <Button
                  data-interactive="true"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 right-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeExperience(index)}
                  aria-label="Remove experience item"
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
              data-interactive="true"
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
      </DraggableResizableItem>

      <DraggableResizableItem path="diyLayout.education">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold" style={headingStyle}>
            <GraduationCap size={20} /> Education
          </h2>
          <div className="space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="group relative">
                <Button
                  data-interactive="true"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 right-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeEducation(index)}
                  aria-label="Remove education item"
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
              data-interactive="true"
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
      </DraggableResizableItem>

      <DraggableResizableItem path="diyLayout.skills">
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
                  data-interactive="true"
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-gray-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove skill: ${watch(`skills.${index}.name`)}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-2" data-interactive="true">
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
      </DraggableResizableItem>
    </div>
  );
}
