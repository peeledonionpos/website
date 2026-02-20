import { Octokit } from "@octokit/core";
import matter from "gray-matter";

// Assuming you setup process.env.GITHUB_TOKEN in Netlify Environment Variables
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Replace these with your actual repo details
const owner = "your-github-username";
const repo = "your-repo-name";

export async function publishBlogToGithub(formData: any) {
    const { title, description, author, slug, sections } = formData;

    // Create markdown body from sections
    const markdownBody = sections.map((sec: any) => `## ${sec.title}\n\n${sec.content}`).join("\n\n");

    // Add YAML Frontmatter
    const finalMarkdown = matter.stringify(markdownBody, {
        title,
        description,
        author,
        date: new Date().toISOString()
    });

    const path = `src/content/blogs/${slug}.md`;
    const message = `Publish blog: ${title}`;

    try {
        // Check if file already exists so we can get its SHA to update it
        let sha;
        try {
            const { data } = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
                owner,
                repo,
                path,
            });
            // @ts-ignore
            sha = data.sha;
        } catch (e: any) {
            if (e.status !== 404) throw e;
        }

        // Create or update the file
        await octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
            owner,
            repo,
            path,
            message,
            content: Buffer.from(finalMarkdown).toString('base64'),
            sha, // only needed if updating
        });

        return { success: true };
    } catch (error) {
        console.error("Error pushing to GitHub:", error);
        return { success: false, error };
    }
}
