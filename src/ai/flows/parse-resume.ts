
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
  startDate: z.string().optional().describe('The start date of the employment.'),
  endDate: z.string().optional().describe("The end date of the employment (or 'Present')."),
  description: z.string().optional().describe('A description of the responsibilities and achievements, with newlines for bullet points.'),
});

const ParsedEducationSchema = z.object({
  degree: z.string().describe('The degree or certificate obtained.'),
  institution: z.string().describe('The name of the institution.'),
  location: z.string().optional().describe('The location of the institution.'),
  graduationDate: z.string().optional().describe('The graduation date.'),
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
    const system = `You are a highly accurate resume parsing AI. Your sole purpose is to convert raw resume text into a structured JSON object. Adherence to the schema is critical.

**Critical Parsing Instructions:**

1.  **JSON Output Only**: Your entire response must be a single, valid JSON object. Do not include any conversational text, explanations, or markdown wrappers like \`\`\`json.
2.  **Handle Missing Information Correctly**:
    *   For optional text fields (like \`phone\`, \`website\`, \`summary\`, \`location\`, etc.), if the information is not present in the resume text, **OMIT THE KEY** from the JSON output. Do not include it with \`null\` or an empty string.
    *   For sections that are arrays (like \`experience\`, \`education\`, \`skills\`, \`certifications\`, \`projects\`), if the section is completely absent from the resume, you **MUST** provide an empty array \`[]\`.
3.  **Format Descriptions**: For any \`description\` field (in experience, education, or projects), combine the points into a single string, using the newline character \`\\n\` to separate each bullet point or line.
4.  **Delineate Work Experience**: Be very careful to separate distinct work experiences. A new experience entry usually starts with a new job title, company, and date range. Do not merge responsibilities from different jobs into one entry.

**Example of Expected JSON Structure:**
\`\`\`json
{
  "personalInfo": {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "location": "San Francisco, CA"
  },
  "summary": "A brief professional summary.",
  "experience": [
    {
      "jobTitle": "Software Engineer",
      "company": "Tech Inc.",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "description": "- Developed feature A.\\n- Fixed bug B."
    }
  ],
  "education": [],
  "skills": [
    { "name": "TypeScript" },
    { "name": "React" }
  ]
}
\`\`\`

Now, meticulously parse the following resume text according to these rules.`;

    const user = `**Resume Text:**\n${resumeText}`;
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
