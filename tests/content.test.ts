import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEntry, getEntries, getEntry, getRelated } from '../lib/content.ts';
const valid = '---\ntitle: "An actual experiment"\nsummary: "A clear summary"\ntopic: "Systems"\npublished: true\n---\nActual content.';
test('only explicitly published entries appear in collections and details', () => {
  assert.ok(getEntries('projects').length >= 1);
  assert.ok(getEntries('writing').every(entry => entry.published));
  assert.ok(getEntry('writing', 'google-docs-system-design'));
  assert.equal(getEntry('writing', 'first-note'), undefined);
  assert.equal(parseEntry(valid.replace('published: true', 'published: "true"'), 'example', 'writing').published, false);
});
test('invalid slugs cannot escape the content directory', () => {
  assert.equal(getEntry('projects', '../../package'), undefined);
  assert.throws(() => parseEntry(valid, '../private', 'projects'), /Invalid content slug/);
});
test('missing metadata and malformed cross-links fail clearly', () => {
  assert.throws(() => parseEntry(valid.replace('title: "An actual experiment"', ''), 'example', 'writing'), /title is required/);
  assert.throws(() => parseEntry(valid.replace('published: true', 'related: ["../private"]'), 'example', 'writing'), /related must contain slugs/);
});
test('related content resolves only published entries in the other collection', () => {
  const project = getEntry('projects', 'the-margin-notes')!;
  assert.deepEqual(getRelated({ ...project, related: ['first-note'] }), []);
  const draft = parseEntry(valid.replace('published: true', 'related: ["the-margin-notes"]'), 'test-note', 'writing');
  assert.deepEqual(getRelated(draft).map(p => p.slug), ['the-margin-notes']);
});

test('project images require a local asset path and descriptive alt text', () => {
  const withImage = valid.replace('published: true', 'published: true\nimage: "/projects/example.svg"\nimageAlt: "Example project cover"');
  assert.equal(parseEntry(withImage, 'example', 'projects').image, '/projects/example.svg');
  assert.throws(() => parseEntry(withImage.replace('/projects/example.svg', 'https://example.com/image.svg'), 'example', 'projects'), /local project image/);
  assert.throws(() => parseEntry(withImage.replace('imageAlt: "Example project cover"', ''), 'example', 'projects'), /imageAlt is required/);
});
