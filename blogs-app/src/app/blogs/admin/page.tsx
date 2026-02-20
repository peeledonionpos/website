"use client";

import { useState } from "react";
import { publishBlogAction } from "@/app/blogs/admin/actions"; // Server action to publish to github
import { Save, Plus, Trash2 } from "lucide-react";

export default function AdminPage() {
    const [isAuth, setIsAuth] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [sections, setSections] = useState([{ title: "", content: "" }]);

    const [publishing, setPublishing] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin" && password === "19111999") {
            setIsAuth(true); // Secure with proper session/cookie logic in production
        } else {
            alert("Invalid credentials");
        }
    };

    const addSection = () => {
        setSections([...sections, { title: "", content: "" }]);
    };

    const updateSection = (index: number, field: string, value: string) => {
        setSections((prev) =>
            prev.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec))
        );
    };

    const removeSection = (index: number) => {
        const newSections = [...sections];
        newSections.splice(index, 1);
        setSections(newSections);
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        setPublishing(true);

        try {
            const result = await publishBlogAction({ title, slug, description, author, sections });
            if (result.success) {
                alert("Published successfully!");
            } else {
                alert("Publish failed. See console mapping.");
            }
        } catch (e: unknown) {
            console.error(e);
            alert("An error occurred");
        } finally {
            setPublishing(false);
        }
    };

    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <form onSubmit={handleLogin} className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-6 text-center">Blog Editor Log In</h1>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full p-2 mb-6 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        Log In
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800">New Blog Post</h1>
                    <button
                        onClick={handlePublish}
                        disabled={publishing || !title || !slug}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        <Save size={18} />
                        {publishing ? "Publishing to GitHub..." : "Publish to Netlify"}
                    </button>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Title</label>
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="How GST works for Restaurants"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">URL Slug</label>
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                placeholder="how-gst-works"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Meta Description (SEO)</label>
                        <textarea
                            className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Keep it under 160 characters for best SEO results..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Author Name</label>
                        <input
                            className="w-full p-3 border rounded-lg max-w-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="PeeledOnion Team"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Content Sections 📝
                        </h2>
                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <div key={index} className="p-5 border rounded-xl bg-gray-50 relative group">
                                    <div className="flex justify-between items-start mb-3">
                                        <input
                                            className="w-full text-xl font-bold p-2 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent outline-none transition"
                                            placeholder="Section Header (H2)"
                                            value={section.title}
                                            onChange={(e) => updateSection(index, "title", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSection(index)}
                                            className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Write the paragraph content here in Markdown..."
                                        value={section.content}
                                        onChange={(e) => updateSection(index, "content", e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addSection}
                            className="mt-4 flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition"
                        >
                            <Plus size={20} />
                            Add New Section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
