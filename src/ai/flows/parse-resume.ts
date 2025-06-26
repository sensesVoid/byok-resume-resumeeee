
'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

// Schemas for what the AI should output. These omit IDs.
const ParsedPersonalInfoSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  email: z.string().email().describe('The email address.'),
  phone: z.string().optional().describe('The phone number.'),
  website: z.string().url().optional().describe('The personal website or portfolio URL.'),
  location: z.string().optional().describe('The city and state, e.g., "San Francisco, CA".'),
});

const ParsedExperienceSchema = z.object({
  jobTitle: z.string().describe('The job title.'),
  company: z.string().describe('The company name.'),
  location: z.string().optional().describe('The location of the company.'),
  startDate: z.string().describe('The start date of the employment.'),
  endDate: z.string().optional().describe("The end date of the employment (or 'Present')."),
  description: z.string().optional().describe('A description of the responsibilities and achievements, with newlines for bullet points.'),
});

const ParsedEducationSchema = z.object({
  degree: z.string().describe('The degree or certificate obtained.'),
  institution: z.string().describe('The name of the institution.'),
  location: z.string().optional().describe('The location of the institution.'),
  graduationDate: z.string().describe('The graduation date.'),
  description: z.string().optional().describe('Any additional details, like GPA or honors.'),
});

const ParsedSkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
});

const ParsedCertificationSchema = z.object({
    name: z.string().describe('The name of the certification.'),
    issuer: z.string().describe('The issuing organization.'),
    date: z.string().optional().describe('The date the certification was obtained.'),
});

const ParsedProjectSchema = z.object({
    name: z.string().describe('The name of the project.'),
    description: z.string().optional().describe('A brief description of the project.'),
    link: z.string().url().optional().or(z.literal('')).describe('A URL link to the project.'),
});


// The final output schema for the flow
const ParseResumeOutputSchema = z.object({
  personalInfo: ParsedPersonalInfoSchema,
  summary: z.string().optional().describe('A professional summary about the person.'),
  experience: z.array(ParsedExperienceSchema).describe('A list of work experiences.'),
  education: z.array(ParsedEducationSchema).describe('A list of educational qualifications.'),
  skills: z.array(ParsedSkillSchema).describe('A list of skills.'),
  certifications: z.array(ParsedCertificationSchema).optional().describe('A list of certifications.'),
  projects: z.array(ParsedProjectSchema).optional().describe('A list of projects.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

// Input schema for the flow
const ParseResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The full text content of the resume to be parsed.'),
  aiConfig: aiConfigSchema,
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

function buildPrompts(resumeText: string): { system: string; user: string } {
    const system = `**Primary Goal:** Convert the user-provided resume text into a single, valid JSON object.

**CRITICAL RULES:**
1.  **JSON ONLY:** Your entire output must be a single JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
2.  **Work Experience Parsing:** This is the most important rule. Each work experience entry is separate. A new job begins with a new Job Title. All bullet points following a Job Title belong ONLY to that job until the next Job Title is found. Do not merge descriptions from different jobs.
3.  **Use Newlines:** For 'description' fields (experience and projects), use the newline character (\\n) for each bullet point. Example: "- Did thing A.\\n- Did thing B."
4.  **Omit Empty Optional Fields:** If an optional field (like 'phone', 'website', 'summary', or a job 'description') is not in the resume, completely OMIT the key from the JSON. Do not include it with a null or empty value.
5.  **Use Empty Arrays:** For sections like 'experience', 'education', 'skills', 'certifications', or 'projects', if the entire section is missing from the resume, you MUST use an empty array: [].

**JSON OUTPUT STRUCTURE EXAMPLE:**
{
  "personalInfo": { "name": "Jane Doe", "email": "jane.doe@example.com" },
  "summary": "Professional summary here.",
  "experience": [
    { "jobTitle": "Software Engineer", "company": "Tech Inc.", "startDate": "Jan 2020", "endDate": "Present", "description": "- Developed feature A.\\n- Fixed bug B." }
  ],
  "education": [
    { "degree": "B.S. Computer Science", "institution": "State University", "graduationDate": "May 2020" }
  ],
  "skills": [ { "name": "TypeScript" }, { "name": "React" } ],
  "certifications": [],
  "projects": []
}

Based on these strict rules, parse the following resume text.`;

    const user = `**Resume Text:**
---
${resumeText}
---`;
    return { system, user };
}


export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  const prompts = buildPrompts(input.resumeText);

  try {
    const jsonString = await callApi({ prompts, aiConfig: input.aiConfig });
    const parsedJson = JSON.parse(jsonString);
    return ParseResumeOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to parse resume JSON response:', error);
    
    if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        throw new Error('The AI response did not match the expected resume structure. Please check the file or try another AI provider.');
    }
    
    throw new Error(error.message || 'An unexpected error occurred while parsing the resume.');
  }
}
