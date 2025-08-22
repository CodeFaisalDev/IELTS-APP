import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function BlogPage() {
  // This is sample data. In a real application, you would fetch this from an API.
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js and Tailwind CSS",
      description:
        "A comprehensive guide to setting up a modern web development environment.",
      date: "August 15, 2025",
      slug: "getting-started-nextjs-tailwind",
    },
    {
      id: 2,
      title: "The Future of Machine Learning in Web Development",
      description:
        "How AI and ML are changing the way we build web applications.",
      date: "August 10, 2025",
      slug: "future-ml-web-dev",
    },
    {
      id: 3,
      title: "Why Component-Based Architecture is the New Standard",
      description:
        "Exploring the benefits of building with reusable components.",
      date: "August 5, 2025",
      slug: "component-based-architecture",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-5xl px-4">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            Our Blog
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Insights, tutorials, and thoughts on full-stack development and
            machine learning.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <Card className="shadow-lg bg-white dark:bg-gray-800 border-none transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {post.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Placeholder for future pagination or "Load More" functionality */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            More articles coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
