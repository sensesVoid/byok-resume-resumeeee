
export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: 'how-to-beat-the-ats',
    title: 'How to Beat the Applicant Tracking System (ATS)',
    date: 'June 25, 2024',
    excerpt: 'Learn the secrets to crafting a resume that sails through automated screening systems and lands on a recruiter\'s desk.',
    content: `
<p>The Applicant Tracking System (ATS) is the first gatekeeper most job seekers face. It's software that scans, sorts, and ranks resumes based on keywords and formatting before a human ever sees them. Here’s how to optimize your resume to beat the bots.</p>
<h3 class="font-bold mt-4 mb-2 text-xl">1. Use the Right Keywords</h3>
<p>The most crucial step is to mirror the language of the job description. Scour the posting for key skills, qualifications, and responsibilities. If the description mentions "project management," "data analysis," or "SaaS," make sure those exact phrases appear in your resume (where relevant, of course).</p>
<h3 class="font-bold mt-4 mb-2 text-xl">2. Keep Formatting Simple</h3>
<p>While a highly designed resume can be visually appealing, ATS software prefers simplicity. Stick to:</p>
<ul class="list-disc pl-5 space-y-1">
  <li>Standard fonts like Arial, Calibri, or Times New Roman.</li>
  <li>A clean, single-column layout. Avoid tables, columns, and text boxes.</li>
  <li>Standard bullet points (circles or squares).</li>
  <li>Clear section headings like "Work Experience," "Education," and "Skills."</li>
</ul>
<h3 class="font-bold mt-4 mb-2 text-xl">3. File Type Matters</h3>
<p>Unless the application specifically requests a PDF, a .docx file is often the safest bet. Some older ATS systems can struggle to parse PDFs correctly, especially if they contain complex formatting or images. Our app allows you to download in both formats, so you can choose what's best for each application.</p>
<h3 class="font-bold mt-4 mb-2 text-xl">4. Don't Put Crucial Info in Headers or Footers</h3>
<p>Some ATS scanners are configured to ignore headers and footers. It's essential to keep your name, contact information, and other vital details within the main body of the document to ensure they get parsed correctly.</p>
<p class="mt-4">By focusing on clear, keyword-rich content and simple formatting, you dramatically increase your chances of making it past the initial automated screening and into the hands of a human recruiter.</p>
`
  },
  {
    slug: '5-action-verbs',
    title: '5 Action Verbs to Supercharge Your Resume',
    date: 'June 24, 2024',
    excerpt: 'Tired of "responsible for"? Replace weak phrases with powerful action verbs that showcase your accomplishments and impact.',
    content: `
<p>The words you choose on your resume matter. Strong action verbs paint a picture of you as a proactive and accomplished professional. Banish passive phrases like "was responsible for" and replace them with dynamic verbs that command attention.</p>
<h3 class="font-bold mt-4 mb-2 text-xl">Instead of "Managed," try:</h3>
<ul class="list-disc pl-5 space-y-1">
  <li><strong>Orchestrated:</strong> Implies complex coordination. "Orchestrated a multi-departmental product launch."</li>
  <li><strong>Spearheaded:</strong> Shows you took the lead. "Spearheaded the transition to a new CRM system."</li>
</ul>
<h3 class="font-bold mt-4 mb-2 text-xl">Instead of "Created," try:</h3>
<ul class="list-disc pl-5 space-y-1">
  <li><strong>Engineered:</strong> Suggests technical skill and design. "Engineered a new data processing pipeline."</li>
  <li><strong>Pioneered:</strong> Implies being the first to do something. "Pioneered a new social media marketing strategy."</li>
</ul>
<h3 class="font-bold mt-4 mb-2 text-xl">Instead of "Improved," try:</h3>
<ul class="list-disc pl-5 space-y-1">
  <li><strong>Optimized:</strong> Shows efficiency gains. "Optimized database queries, reducing report generation time by 50%."</li>
  <li><strong>Revitalized:</strong> Suggests bringing something back to life. "Revitalized an underperforming sales territory, increasing revenue by 25%."</li>
</ul>
<p class="mt-4">Using vivid, results-oriented language helps recruiters immediately grasp the scope and impact of your contributions, making your resume far more compelling.</p>
`
  },
  {
    slug: 'tailoring-your-resume',
    title: 'Tailoring Your Resume: The Secret to Getting More Interviews',
    date: 'June 23, 2024',
    excerpt: 'Sending the same generic resume to every job is a common mistake. Learn why customizing your resume for each application is critical for success.',
    content: `
<p>In today's competitive job market, a one-size-fits-all resume is no longer effective. Recruiters and hiring managers are looking for candidates who are a perfect fit for a specific role. Tailoring your resume is the single best way to show them you're that person.</p>
<h3 class="font-bold mt-4 mb-2 text-xl">Why Tailor?</h3>
<p><strong>1. It Beats the ATS:</strong> As we discussed in another post, Applicant Tracking Systems are looking for specific keywords from the job description. Tailoring ensures you have them.</p>
<p><strong>2. It Shows Genuine Interest:</strong> A customized resume proves you've read the job description carefully and are genuinely interested in this specific role, not just blasting out applications.</p>
<p><strong>3. It Highlights Your Most Relevant Skills:</strong> Every job has different priorities. Tailoring allows you to reorder your bullet points and skills to put the most important qualifications for that specific job right at the top.</p>
<h3 class="font-bold mt-4 mb-2 text-xl">How to Tailor Effectively</h3>
<ul class="list-disc pl-5 space-y-1">
  <li><strong>Analyze the Job Description:</strong> Break it down. What are the must-have skills? What are the nice-to-haves? What words or phrases are repeated most often?</li>
  <li><strong>Update Your Professional Summary:</strong> Your summary should be a direct pitch for the job you're applying for. Tweak it to reflect the key requirements of the role.</li>
  <li><strong>Reorder and Rewrite Bullet Points:</strong> Don't just list what you did. Frame your accomplishments in the context of what the company is looking for. If the job emphasizes data analysis, lead with your strongest data-related achievements.</li>
  <li><strong>Adjust Your Skills Section:</strong> Add any relevant skills mentioned in the job description that you possess, and consider removing less relevant ones to keep the section focused.</li>
</ul>
<p class="mt-4">Yes, tailoring takes a few extra minutes per application, but the return on investment—more interviews and better job offers—is well worth the effort.</p>
`
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
