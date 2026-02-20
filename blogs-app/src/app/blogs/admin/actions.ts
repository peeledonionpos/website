"use server";

import { publishBlogToGithub } from "@/lib/github";

export async function publishBlogAction(formData: { title: string, description: string, author: string, slug: string, sections: { title: string, content: string }[] }) {
    try {
        const res = await publishBlogToGithub(formData);
        if (!res.success) {
            throw res.error;
        }
        return { success: true };
    } catch (err: unknown) {
        console.error("Action Error:", err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
}
