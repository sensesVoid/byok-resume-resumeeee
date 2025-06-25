
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

function buildPrompt(resumeText: string): string {
    return `You are an expert resume parser. Your task is to meticulously convert the following resume text into a single, valid JSON object.

**CRITICAL PARSING LOGIC FOR WORK EXPERIENCE:**
For each job listed under "WORK EXPERIENCE", you must associate the responsibilities (bullet points) ONLY with the job title they fall directly under. For example, if you see:
Job Title A
Company A
- Responsibility 1
- Responsibility 2
Job Title B
Company B
- Responsibility 3
The description for "Job Title A" is "- Responsibility 1\\n- Responsibility 2". The description for "Job Title B" is "- Responsibility 3". Do NOT group all descriptions together under the last job.

**CRITICAL JSON FORMATTING RULES:**
1.  Your entire response MUST be ONLY the JSON object. Do not include any text before or after it, and do not use markdown formatting like \`\`\`json.
2.  If an optional field is not present in the resume text (like 'phone', 'website', 'summary', or a job 'description'), completely OMIT the key from the JSON. Do not include it with a null or empty value.
3.  For array fields ('education', 'skills', 'certifications', 'projects'), if that entire section is not found in the resume, you MUST use an empty array: [].
4.  Inside 'description' fields, you MUST use the newline character (\\n) to represent line breaks or bullet points.

**EXAMPLE JSON OUTPUT STRUCTURE:**
{
  "personalInfo": {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "location": "New York, NY"
  },
  "summary": "A brief professional summary.",
  "experience": [
    {
      "jobTitle": "Senior Software Engineer",
      "company": "Tech Solutions Inc.",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "description": "- Developed feature A.\\n- Fixed bug B."
    },
    {
      "jobTitle": "Quality Control Operator",
      "company": "Manufacturing Co.",
      "startDate": "Jun 2018",
      "endDate": "Dec 2019"
    }
  ],
  "education": [
    {
      "degree": "B.S. Computer Science",
      "institution": "University of Example",
      "graduationDate": "May 2020"
    }
  ],
  "skills": [
    { "name": "TypeScript" },
    { "name": "React" }
  ],
  "certifications": [],
  "projects": []
}

**Resume Text to Parse:**
---
${resumeText}
---

Now, provide ONLY the JSON object based on the rules and logic above.`;
}


export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  const prompt = buildPrompt(input.resumeText);

  try {
    const jsonString = await callApi({ prompt, aiConfig: input.aiConfig });
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
