"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"SUCCESS" | "FAILED" | null>(null);

  useEffect(() => {
    emailjs.init("UX0NA-SOoEFaCwVID");
  }, []);

  const sendSubscriptionEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    const templateParams = {
      user_email: email,
      from_name: "SARAL",
      reply_to: email,
      subject: "Materials about reading difficulties",
      message: `
      Hello,

      Thank you for subscribing! Please find the materials about reading difficulties at this link:

      https://example.com/materials/reading-difficulties.pdf

      Best regards,
      SARAL Team
    `,
    };

    emailjs.send("service_5fx0u9a", "template_38dyt11", templateParams).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setStatus("SUCCESS");
        setEmail("");
        setTimeout(() => setStatus(null), 5000);
      },
      (err) => {
        console.error("FAILED...", err);
        setStatus("FAILED");
        setTimeout(() => setStatus(null), 5000);
      },
    );
  };

  return (
    <footer className="bg-white border-t border-[var(--darkblue)]/10 pt-12 pb-8 px-8 md:px-16 text-[var(--darkblue)]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Row: Brand & Subscription */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--primary)]">
              Built for every mind.
            </h2>
            <Image
              src="/saralLogo.svg"
              alt="Saral Logo"
              width={110}
              height={50}
              className="h-12 w-auto mt-3 inline-block cursor-pointer"
            />
            <p className="text-sm text-[var(--darkblue)]/70 mt-3 leading-relaxed">
              Empowering accessible reading, speech synthesis, and document tools tailored for diverse learning needs.
            </p>
          </div>

          <div className="w-full lg:max-w-lg">
            <h3 className="text-lg font-semibold text-[var(--primary)] mb-1">
              Stay updated with Saral
            </h3>
            <p className="text-xs text-[var(--darkblue)]/70 mb-4">
              Get the latest updates on new features and accessibility improvements.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={sendSubscriptionEmail}>
              <div className="relative flex-1">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  placeholder="Enter your email address"
                  className="w-full py-2.5 px-3 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-honey bg-[var(--cream)]/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button text="Subscribe" type="submit" />
            </form>
            {status === "SUCCESS" && (
              <p className="mt-2 text-xs font-medium text-emerald-600">
                Thank you for subscribing! Check your email for materials.
              </p>
            )}
            {status === "FAILED" && (
              <p className="mt-2 text-xs font-medium text-red-600">
                Oops, something went wrong. Please try again later.
              </p>
            )}
          </div>
        </div>

        {/* Middle Row: Navigation Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-[var(--darkblue)]/10 text-xs">
          <div>
            <h4 className="font-bold text-[var(--primary)] uppercase tracking-wider mb-3">
              Studio & Tools
            </h4>
            <ul className="space-y-2 text-[var(--darkblue)]/80">
              <li><Link href="/feature" className="hover:text-honey transition-colors">Workspace Studio</Link></li>
              <li><Link href="/feature" className="hover:text-honey transition-colors">OCR Image Converter</Link></li>
              <li><Link href="/feature" className="hover:text-honey transition-colors">TTS Reader Engine</Link></li>
              <li><Link href="/feature" className="hover:text-honey transition-colors">Document Importer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--primary)] uppercase tracking-wider mb-3">
              Accessibility
            </h4>
            <ul className="space-y-2 text-[var(--darkblue)]/80">
              <li><Link href="/about" className="hover:text-honey transition-colors">Dyslexia Support</Link></li>
              <li><Link href="/about" className="hover:text-honey transition-colors">Reading Isolation</Link></li>
              <li><Link href="/about" className="hover:text-honey transition-colors">Custom Typography</Link></li>
              <li><Link href="/about" className="hover:text-honey transition-colors">High Contrast Modes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--primary)] uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-[var(--darkblue)]/80">
              <li><Link href="/" className="hover:text-honey transition-colors">Home Dashboard</Link></li>
              <li><Link href="/about" className="hover:text-honey transition-colors">About Us</Link></li>
              <li><Link href="/profile" className="hover:text-honey transition-colors">User Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--primary)] uppercase tracking-wider mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-[var(--darkblue)]/80">
              <li><span className="hover:text-honey cursor-pointer transition-colors" onClick={() => alert("Privacy policy document coming soon")}>Privacy Policy</span></li>
              <li><span className="hover:text-honey cursor-pointer transition-colors" onClick={() => alert("Terms of service document coming soon")}>Terms of Service</span></li>
              <li><span className="hover:text-honey cursor-pointer transition-colors" onClick={() => alert("Contact support at help@saral.org")}>Help Center</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[var(--darkblue)]/5 text-xs text-[var(--darkblue)]/60">
          <p>© {new Date().getFullYear()} SARAL. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Where reading is accessible to every mind.</p>
        </div>
      </div>
    </footer>
  );
}

