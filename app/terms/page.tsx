import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function TermsAndServicesPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="shadow-xl bg-white dark:bg-gray-800 border-none">
          <CardHeader className="p-8 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Terms of Service
            </CardTitle>
            <CardDescription className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              Last updated: August 21, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-gray-700 dark:text-gray-300 space-y-6">
            <section>
              <p className="leading-relaxed">
                Please read these Terms of Service (&quot;Terms&quot;,
                &quot;Terms of Service&quot;) carefully before using our
                application (the &quot;Service&quot;) operated by us. Your
                access to and use of the Service is conditioned on your
                acceptance of and compliance with these Terms. These Terms apply
                to all visitors, users, and others who access or use the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Service, you agree to be bound by
                these Terms. If you disagree with any part of the terms, then
                you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                2. User Accounts
              </h2>
              <p>
                When you create an account with us, you must provide us with
                information that is accurate, complete, and current at all
                times. Failure to do so constitutes a breach of the Terms, which
                may result in immediate termination of your account on our
                Service. You are responsible for safeguarding the password that
                you use to access the Service and for any activities or actions
                under your password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                3. User Conduct
              </h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  Violate any local, state, national, or international law.
                </li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  otherwise misrepresent your affiliation with a person or
                  entity.
                </li>
                <li>
                  Interfere with or disrupt the Service or servers or networks
                  connected to the Service.
                </li>
                <li>
                  Upload or transmit any material that infringes any patent,
                  trademark, trade secret, copyright, or other proprietary
                  rights of any party.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                4. Intellectual Property
              </h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of our
                company and its licensors. The Service is protected by
                copyright, trademark, and other laws of both the Bangladesh and
                foreign countries. Our trademarks may not be used in connection
                with any product or service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                5. Termination
              </h2>
              <p>
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms. Upon termination,
                your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                6. Limitation Of Liability
              </h2>
              <p>
                In no event shall our company, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                7. Governing Law
              </h2>
              <p>
                These Terms shall be governed and construed in accordance with
                the laws of Bangladesh, without regard to its conflict of law
                provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                8. Changes to These Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. We will provide notice of
                changes on this page. By continuing to access or use our Service
                after those revisions become effective, you agree to be bound by
                the revised terms. -
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                9. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  By email:{" "}
                  <Link
                    href="mailto:support@example.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@example.com
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
