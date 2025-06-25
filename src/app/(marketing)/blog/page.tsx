
import { posts } from '@/lib/posts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Resumeeee',
  description: 'Articles and tips on resume writing, job searching, and career advice.',
};

export default function BlogIndexPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Resumeeee Blog</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Tips, tricks, and insights to help you land your dream job.
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <Card className="transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription className="pt-2">
                  <p className="text-sm">{post.excerpt}</p>
                  <time dateTime={post.date} className="text-xs text-muted-foreground/80 mt-3 block">
                    {post.date}
                  </time>
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
