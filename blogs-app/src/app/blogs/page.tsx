import { getAllBlogs } from "@/lib/markdown";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "PeeledOnion Blogs | Restaurant Billing & Management",
    description: "Learn about GST billing, KOT management, inventory control, and how to scale your food business with our free cloud POS system.",
};

export default function BlogsIndex() {
    const blogs = getAllBlogs();

    return (
        <main className="min-h-screen bg-white">
            <nav className="border-b py-4 px-6 md:px-12 flex justify-between items-center bg-gray-50 sticky top-0 z-10 shadow-sm">
                <Link href="/" className="font-bold text-xl text-black">🧅 PeeledOnion</Link>
                <Link href="https://peeledonion.in/app/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">Start for Free</Link>
            </nav>

            <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-6 border-b">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
                        Restaurant Growth Hub
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">
                        Guides, tips, and insights to help you manage and scale your food business efficiently.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto grid gap-10">
                    {blogs.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed">
                            <p className="text-gray-500 font-medium">No blog posts found. Head to /admin to create some!</p>
                        </div>
                    ) : (
                        blogs.map((blog: any) => (
                            <article key={blog.slug} className="group flex flex-col items-start border rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition duration-300 bg-white">
                                <div className="w-full flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {blog.meta.author || "PeeledOnion Team"}
                                    </span>
                                    <time dateTime={blog.meta.date} className="text-sm text-gray-500 font-medium">
                                        {new Date(blog.meta.date).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </time>
                                </div>

                                <Link href={`/blogs/${blog.slug}`} className="w-full">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition">
                                        {blog.meta.title}
                                    </h2>
                                </Link>

                                <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                                    {blog.meta.description.substring(0, 160)}...
                                </p>

                                <Link href={`/blogs/${blog.slug}`} className="font-bold text-blue-600 group-hover:text-blue-800 flex items-center gap-2 transition relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 group-hover:after:w-full after:bg-blue-600 after:transition-all">
                                    Read Article <ArrowRight size={16} />
                                </Link>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
