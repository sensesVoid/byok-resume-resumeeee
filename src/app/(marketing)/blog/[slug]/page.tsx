
import { getPostBySlug, posts } from '@/lib/posts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Resumeeee Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published on <time dateTime={post.date}>{post.date}</time>
        </p>
      </header>

      <div
        className="prose prose-lg mx-auto max-w-none space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
