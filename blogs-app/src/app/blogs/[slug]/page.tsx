import { getBlogBySlug, getBlogFiles } from "@/lib/markdown";
import { generateSEOMeta, generateBlogSchema } from "@/lib/seo";
import { marked } from "marked";
import Link from "next/link";
import { notFound } from "next/navigation";

// Next.js static global param generation for Netlify Edge
export async function generateStaticParams() {
    const files = getBlogFiles();
    return files.map((file) => ({
        slug: file.replace(/\.md$/, ""),
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const blog = getBlogBySlug(params.slug);
    if (!blog) return {};

    return generateSEOMeta(
        blog.meta.title,
        blog.meta.description,
        `https://peeledonion.in/blogs/${params.slug}`
    );
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
    const blog = getBlogBySlug(params.slug);
    if (!blog) return notFound();

    // Convert pure Markdown to HTML
    const contentHtml = await marked(blog.content);

    const schema = generateBlogSchema(
        blog.meta.title,
        blog.meta.description,
        `https://peeledonion.in/blogs/${blog.slug}`,
        blog.meta.date,
        blog.meta.author
    );

    return (
        <>
            {/* Auto-injected JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            <main className="min-h-screen bg-white">
                {/* Simple Navbar (no images size limit) */}
                <nav className="border-b py-4 px-6 md:px-12 flex justify-between items-center bg-gray-50">
                    <Link href="/" className="font-bold text-xl text-black">🧅 PeeledOnion</Link>
                    <Link href="/blogs" className="text-sm font-medium hover:text-blue-600 transition">All Articles</Link>
                </nav>

                {/* Article Container */}
                <article className="max-w-3xl mx-auto px-6 py-16">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
                            {blog.meta.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    {blog.meta.author.charAt(0)}
                                </div>
                                {blog.meta.author}
                            </span>
                            <span>•</span>
                            <time dateTime={blog.meta.date}>
                                {new Date(blog.meta.date).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </time>
                        </div>
                    </header>

                    {/* Markdown Output styled strictly via Tailwind Prose-like custom classes for zero-bloat */}
                    <div
                        className="prose prose-lg max-w-none text-gray-800
                       prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
                       prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                       prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-500
                       prose-li:my-2 prose-ul:list-disc prose-ul:pl-6"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />

                </article>

                <section className="bg-gray-50 py-16 mt-20 border-t">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Start your restaurant billing for free.</h2>
                        <p className="text-gray-600 mb-8">PeeledOnion is lifetime free billing software. No credit card needed.</p>
                        <a href="https://peeledonion.in/app/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition transform hover:-translate-y-1 inline-block">
                            Create Free POS Account
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
}
