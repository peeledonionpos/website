"use server";

import { publishBlogToGithub } from "@/lib/github";

export async function publishBlogAction(formData: any) {
    try {
        const res = await publishBlogToGithub(formData);
        if (!res.success) {
            throw res.error;
        }
        return { success: true };
    } catch (err: any) {
        console.error("Action Error:", err);
        return { success: false, error: err.message };
    }
}
