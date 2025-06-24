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

// The final output schema for the flow
const ParseResumeOutputSchema = z.object({
  personalInfo: ParsedPersonalInfoSchema,
  summary: z.string().optional().describe('A professional summary about the person.'),
  experience: z.array(ParsedExperienceSchema).describe('A list of work experiences.'),
  education: z.array(ParsedEducationSchema).describe('A list of educational qualifications.'),
  skills: z.array(ParsedSkillSchema).describe('A list of skills.'),
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
    return `You are an expert resume parser. Your task is to analyze the provided resume text and extract the information into a structured JSON format.

**Instructions:**
1.  Analyze the resume text provided below.
2.  Extract the information for each section: personal info, summary, experience, education, and skills.
3.  For descriptions, capture key responsibilities and achievements as a single string with newline characters (\\n) for bullet points.
4.  Return **only** a single, valid JSON object. Do not include any other text, markdown formatting like \`\`\`json, or explanations before or after the JSON object.

**Example JSON Structure:**
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "website": "https://johndoe.dev",
    "location": "San Francisco, CA"
  },
  "summary": "Innovative and deadline-driven Software Engineer...",
  "experience": [
    {
      "jobTitle": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "Palo Alto, CA",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "description": "- Led a team of 5 engineers...\\n- Optimized application performance..."
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "State University",
      "location": "Anytown, USA",
      "graduationDate": "May 2019",
      "description": "Graduated with honors, GPA 3.8/4.0."
    }
  ],
  "skills": [
    { "name": "React" },
    { "name": "Node.js" }
  ]
}

**Resume Text to Parse:**
---
${resumeText}
---

Now, parse the resume text above and provide the JSON output.`;
}

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  const prompt = buildPrompt(input.resumeText);

  try {
    const jsonString = await callApi({ prompt, aiConfig: input.aiConfig });
    
    // The callApi function now attempts to return a clean JSON string.
    // Now we parse it and validate against the schema.
    const parsedJson = JSON.parse(jsonString);
    return ParseResumeOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to parse resume JSON response:', error);
    
    // Create a more user-friendly error message based on the error type
    if (error instanceof z.ZodError) {
        // This means the JSON structure was valid, but the data didn't match our schema
        console.error("Zod validation errors:", error.errors);
        throw new Error('The AI response structure was unexpected. Please check the resume file or try again.');
    } else if (error instanceof SyntaxError) { // Catches JSON.parse errors
        // This means the string from callApi was not valid JSON
        throw new Error('The AI returned a malformed response. The document may not be a valid resume.');
    }
    
    // For other errors (e.g. from callApi's fetch)
    throw new Error(error.message || 'An unexpected error occurred while parsing the resume.');
  }
}
