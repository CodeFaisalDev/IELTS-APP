import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="shadow-xl bg-white dark:bg-gray-800 border-none transition-transform duration-500 hover:scale-[1.01]">
          <CardHeader className="p-8 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 animate-fade-in-up">
              About the Developer
            </CardTitle>
            <CardDescription className="mt-2 text-lg text-gray-500 dark:text-gray-400 animate-fade-in-up-delay-1">
              Building the future, one line of code at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-gray-700 dark:text-gray-300 space-y-8 animate-fade-in-up-delay-2">
            <section className="space-y-4 leading-relaxed">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Hi, I'm Faisal Sorkar.
              </h2>
              <p>
                I'm a passionate **Full-stack Developer** and **Machine Learning
                Engineer** based in Narayanganj, Bangladesh. I believe that
                technology has the power to solve real-world problems and I'm
                dedicated to building solutions that are both powerful and easy
                to use.
              </p>
              <p>
                From designing elegant user interfaces to engineering robust
                backend systems and implementing intelligent machine learning
                models, I love bringing ideas to life across the entire
                technology stack.
              </p>
            </section>

            <section className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Let's Connect!
              </h3>
              <p className="mb-4">
                I'm always excited to collaborate and share knowledge. Feel free
                to explore my projects on GitHub.
              </p>
              <a
                href="https://github.com/CodeFaisalDev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium hover:underline transition-transform duration-300 hover:scale-105"
              >
                <Github size={24} />
                <span>Visit My GitHub Profile</span>
              </a>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
