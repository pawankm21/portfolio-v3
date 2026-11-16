import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Collection = 'projects' | 'writing';
export type Entry = {
  slug: string; collection: Collection; title: string; summary: string;
  topic: string; status: 'in-progress' | 'complete' | 'experiment' | 'note';
  published: boolean; featured: boolean; date: string; body: string;
  related: string[]; image?: string; imageAlt?: string;
};
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseEntry(raw: string, slug: string, collection: Collection): Entry {
  if (!validSlug.test(slug)) throw new Error(`Invalid content slug: ${slug}`);
  const { data, content } = matter(raw);
  for (const field of ['title', 'summary', 'topic']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`${slug}: ${field} is required`);
  }
  const status = data.status ?? (collection === 'writing' ? 'note' : 'in-progress');
  if (!['in-progress', 'complete', 'experiment', 'note'].includes(status)) throw new Error(`${slug}: invalid status`);
  const date = data.date ?? '';
  if (typeof date !== 'string' || (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))))) throw new Error(`${slug}: date must be a quoted YYYY-MM-DD string`);
  if (data.related !== undefined && (!Array.isArray(data.related) || data.related.some((item: unknown) => typeof item !== 'string' || !validSlug.test(item)))) throw new Error(`${slug}: related must contain slugs`);
  if (data.image !== undefined && (typeof data.image !== 'string' || !/^\/projects\/[a-z0-9-]+\.(png|jpg|webp|svg)$/.test(data.image))) throw new Error(`${slug}: image must be a local project image`);
  if (data.image !== undefined && (typeof data.imageAlt !== 'string' || !data.imageAlt.trim())) throw new Error(`${slug}: imageAlt is required`);
  return { image: data.image, imageAlt: data.imageAlt, slug, collection, title: data.title.trim(), summary: data.summary.trim(), topic: data.topic.trim(), status, published: data.published === true, featured: data.featured === true, date, body: content, related: data.related ?? [] };
}
export function getEntries(collection: Collection): Entry[] {
  const directory = path.join(process.cwd(), 'content', collection);
  return fs.readdirSync(directory).filter(file => file.endsWith('.mdx')).map(file => parseEntry(fs.readFileSync(path.join(directory, file), 'utf8'), file.slice(0, -4), collection)).filter(entry => entry.published).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
export function getEntry(collection: Collection, slug: string): Entry | undefined {
  if (!validSlug.test(slug)) return undefined;
  return getEntries(collection).find(entry => entry.slug === slug);
}
export function getRelated(entry: Entry): Entry[] {
  const other = entry.collection === 'projects' ? 'writing' : 'projects';
  return getEntries(other).filter(item => entry.related.includes(item.slug));
}
export const statusLabel = (status: Entry['status']) => ({ 'in-progress': 'In progress', complete: 'Complete', experiment: 'Experiment', note: 'Note' })[status];
