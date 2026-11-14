import { notFound } from 'next/navigation';
import { getEntries, getEntry } from '@/lib/content';
import { Article } from '@/components/article';
import Writing from '@/components/writing-index';
export const dynamicParams = false;
// The notebook index is a real generated route even before the first article.
export function generateStaticParams() { return [{ slug: [] }, ...getEntries('writing').map(entry => ({ slug: [entry.slug] }))]; }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!slug?.length) return { title: 'Writing', description: 'An engineering notebook on systems, AI, electronics, and the questions in between.' };
  const entry = slug.length === 1 ? getEntry('writing', slug[0]) : undefined;
  return { title: entry?.title ?? 'Note not found', description: entry?.summary };
}
export default async function Notebook({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!slug?.length) return <Writing />;
  const entry = slug.length === 1 ? getEntry('writing', slug[0]) : undefined;
  if (!entry) notFound();
  return <Article entry={entry} />;
}
