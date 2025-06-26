
import * as React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamicTemplates = {
  modern: dynamic(() => import('@/components/templates/modern-template').then(mod => mod.ModernTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  classic: dynamic(() => import('@/components/templates/classic-template').then(mod => mod.ClassicTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  creative: dynamic(() => import('@/components/templates/creative-template').then(mod => mod.CreativeTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  minimalist: dynamic(() => import('@/components/templates/minimalist-template').then(mod => mod.MinimalistTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  professional: dynamic(() => import('@/components/templates/professional-template').then(mod => mod.ProfessionalTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  elegant: dynamic(() => import('@/components/templates/elegant-template').then(mod => mod.ElegantTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  geometric: dynamic(() => import('@/components/templates/geometric-template').then(mod => mod.GeometricTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  technical: dynamic(() => import('@/components/templates/technical-template').then(mod => mod.TechnicalTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  corporate: dynamic(() => import('@/components/templates/corporate-template').then(mod => mod.CorporateTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  infographic: dynamic(() => import('@/components/templates/infographic-template').then(mod => mod.InfographicTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  academic: dynamic(() => import('@/components/templates/academic-template').then(mod => mod.AcademicTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  startup: dynamic(() => import('@/components/templates/startup-template').then(mod => mod.StartupTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  executive: dynamic(() => import('@/components/templates/executive-template').then(mod => mod.ExecutiveTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  marketing: dynamic(() => import('@/components/templates/marketing-template').then(mod => mod.MarketingTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  designer: dynamic(() => import('@/components/templates/designer-template').then(mod => mod.DesignerTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  developer: dynamic(() => import('@/components/templates/developer-template').then(mod => mod.DeveloperTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  legal: dynamic(() => import('@/components/templates/legal-template').then(mod => mod.LegalTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  medical: dynamic(() => import('@/components/templates/medical-template').then(mod => mod.MedicalTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  'two-tone': dynamic(() => import('@/components/templates/two-tone-template').then(mod => mod.TwoToneTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
  compact: dynamic(() => import('@/components/templates/compact-template').then(mod => mod.CompactTemplate), { loading: () => React.createElement(Skeleton, { className: 'w-full h-[1123px]' }) }),
};
