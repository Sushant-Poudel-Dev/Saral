"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Button from "./ui/Button";
import saralLogo from "../media/saralLogo.svg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init("UX0NA-SOoEFaCwVID");
  }, []);

  const sendSubscriptionEmail = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    const templateParams = {
      user_email: email, // <-- fixed key here
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
      }
    );
  };

  return (
    <>
      <div className='flex px-15 py-10'>
        <div className='w-[120%]'>
          <h2>Built for every mind.</h2>
          <img
            src={saralLogo.src}
            alt='Saral Logo'
            className='h-20 mt-2 ml-2 inline-block'
          />
        </div>
        <div className='w-full'>
          <h2>Stay updated with Saral</h2>
          <p className='opacity-80'>
            Get the latest updates on new features and accessibility
            improvements.
          </p>
          <form
            className='flex gap-5 mt-4'
            onSubmit={sendSubscriptionEmail}
          >
            <div className='relative w-3/5'>
              <svg
                className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <input
                type='email'
                name='user_email'
                id='user_email'
                placeholder='Enter your email'
                className='w-full py-3 px-2 pl-10 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              text='Subscribe'
              type='submit'
            />
          </form>
          {status === "SUCCESS" && (
            <p className='mt-2 text-green-600'>
              Thank you for subscribing! Check your email for the materials.
            </p>
          )}
          {status === "FAILED" && (
            <p className='mt-2 text-red-600'>
              Oops, something went wrong. Please try again later.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
