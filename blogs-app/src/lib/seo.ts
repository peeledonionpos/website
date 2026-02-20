export function generateSEOMeta(title: string, description: string, url: string) {
    return {
        title: `${title} | PeeledOnion Blog`,
        description,
        openGraph: {
            type: "article",
            title,
            description,
            url,
            images: [
                {
                    url: "https://peeledonion.in/images/og-home.png",
                    width: 1200,
                    height: 630,
                    alt: "PeeledOnion Billing Software",
                },
            ],
            siteName: "PeeledOnion",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://peeledonion.in/images/og-home.png"],
        },
        alternates: {
            canonical: url,
        },
    };
}

// Generate the JSON-LD Script tag content for a blog post
export function generateBlogSchema(title: string, description: string, url: string, datePublished: string, authorName: string) {
    // We use dual schema here: BlogPosting + SoftwareApplication for SEO cross-pollination
    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            },
            "headline": title,
            "description": description,
            "datePublished": datePublished,
            "author": {
                "@type": "Person",
                "name": authorName
            },
            "publisher": {
                "@type": "Organization",
                "name": "PeeledOnion",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://peeledonion.in/images/logo.png"
                }
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PeeledOnion Free Restaurant Billing Software",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            },
            "url": "https://peeledonion.in"
        }
    ];

    return JSON.stringify(schema);
}
