import { notFound } from 'next/navigation';
import { getEntries, getEntry } from '@/lib/content';
import { Article } from '@/components/article';
export const dynamicParams = false;
export function generateStaticParams() { return getEntries('projects').map(entry => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getEntry('projects', slug); return { title: entry?.title ?? 'Project not found', description: entry?.summary }; }
export default async function Project({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getEntry('projects', slug); if (!entry) notFound(); return <Article entry={entry} />; }
