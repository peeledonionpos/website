import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/blogs');

export const getBlogFiles = cache(function getBlogFiles() {
    if (!fs.existsSync(contentDirectory)) return [];
    return fs.readdirSync(contentDirectory).filter((f) => f.endsWith('.md'));
});

export const getBlogBySlug = cache(function getBlogBySlug(slug: string) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, `${realSlug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return { slug: realSlug, meta: data, content };
});

export type BlogListing = NonNullable<ReturnType<typeof getBlogBySlug>>;

export function getAllBlogs() {
    const slugs = getBlogFiles();
    const blogs = slugs
        .map((slug) => getBlogBySlug(slug.replace(/\.md$/, '')))
        .filter((blog): blog is BlogListing => blog !== null)
        .sort((blog1, blog2) => (blog1.meta.date > blog2.meta.date ? -1 : 1));
    return blogs;
}
