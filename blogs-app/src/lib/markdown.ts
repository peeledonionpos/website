import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/blogs');

export function getBlogFiles() {
    if (!fs.existsSync(contentDirectory)) return [];
    return fs.readdirSync(contentDirectory);
}

export function getBlogBySlug(slug: string) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, `${realSlug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return { slug: realSlug, meta: data, content };
}

export function getAllBlogs() {
    const slugs = getBlogFiles();
    const blogs = slugs
        .map((slug) => getBlogBySlug(slug))
        .filter(Boolean)
        // sort by date
        .sort((blog1: any, blog2: any) => (blog1.meta.date > blog2.meta.date ? -1 : 1));
    return blogs;
}
