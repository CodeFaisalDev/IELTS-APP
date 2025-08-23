import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="shadow-xl bg-white dark:bg-gray-800 border-none">
          <CardHeader className="p-8 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Privacy Policy
            </CardTitle>
            <CardDescription className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              Last updated: August 21, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-gray-700 dark:text-gray-300 space-y-6">
            <section>
              <p className="leading-relaxed">
                Welcome to our application. We are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                services. Please read this policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We may collect information about you in a variety of ways. The
                information we may collect via the Application includes:
              </p>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Personal Data
              </h3>
              <p className="mb-4">
                While using our Service, we may ask you to provide us with
                certain personally identifiable information that can be used to
                contact or identify you (&ldquo;Personal Data&rdquo;). This may
                include, but is not limited to, your email address, name, and
                usage data.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Usage Data
              </h3>
              <p>
                When you access the Service, we may collect information that
                your browser sends whenever you visit our Service or when you
                access the Service by or through a mobile device (&ldquo;Usage
                Data&rdquo;). This Usage Data may include information such as
                your computer&rsquo;s Internet Protocol (IP) address, browser
                type, pages visited, and other diagnostic data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">
                Having accurate information about you permits us to provide you
                with a smooth, efficient, and customized experience.
                Specifically, we may use information collected about you to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Create and manage your account.</li>
                <li>
                  Provide and maintain our Service, including to monitor the
                  usage of our Service.
                </li>
                <li>
                  Improve the application and deliver personalized service.
                </li>
                <li>
                  Communicate with you about your account or our services.
                </li>
                <li>
                  Generate a personal profile of you to make future visits more
                  personalized.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                3. Disclosure of Your Information
              </h2>
              <p>
                We do not share, sell, rent, or trade your information with
                third parties for their commercial purposes. We may share
                information we have collected about you in certain situations,
                such as with third-party service providers who perform services
                for us or on our behalf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                4. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure the personal information you provide
                to us, please be aware that despite our efforts, no security
                measures are perfect or impenetrable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                5. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page. You are advised to review this Privacy Policy
                periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                6. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  By email:{" "}
                  <Link
                    href="mailto:privacy@example.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    privacy@example.com
                  </Link>
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
