"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";

// Hero Components
import HeroImage from "../media/HeroImage.png";
import Arrow from "../media/Arrow.svg";

// Card components
import FeatureCard from "@/components/FeatureCard";
import Volume from "../media/Volume.svg";
import Paint from "../media/Paint.svg";
import Rular from "../media/Rular.svg";

// Quote Components
import Quote from "@/components/Quote";

// Testimonial Components
import TestomonialCard from "@/components/TestomonialCard";

export default function Home() {
  const router = useRouter();
  const [isColorCodingActive, setIsColorCodingActive] = useState(false);

  const handleCTAClick = () => {
    router.push("/feature");
  };

  const renderColorCodedText = (text) => {
    if (!isColorCodingActive) return text;

    // Create a combined regex for all problematic letters
    const combinedRegex = /([bdBDpqPQmwMW])/g;

    return text.split(combinedRegex).map((part, index) => {
      if (!part) return null;

      // Check which pattern this part matches and apply appropriate styling
      if (/[bdBD]/.test(part)) {
        return (
          <span
            key={index}
            className='bg-pink text-white px-1 rounded transition-all duration-300'
          >
            {part}
          </span>
        );
      } else if (/[pqPQ]/.test(part)) {
        return (
          <span
            key={index}
            className='bg-blue text-white px-1 rounded transition-all duration-300'
          >
            {part}
          </span>
        );
      } else if (/[mwMW]/.test(part)) {
        return (
          <span
            key={index}
            className='bg-yellow text-black px-1 rounded transition-all duration-300'
          >
            {part}
          </span>
        );
      }

      // Return normal text
      return part;
    });
  };

  return (
    <>
      <div>
        {/* HERO SECTION */}
        <div className='flex items-start pt-20 justify-evenly gap-50 h-[42rem] px-15'>
          <div className='w-2/5 ml-10 py-10'>
            <h1 className='mb-4'>Where reading becomes easier.</h1>
            <h2 className='mb-4'>
              {renderColorCodedText(
                "Supportive tools for dyslexia, ADHD, and autism with customizable text, color-coded letters, and read-aloud in English and Nepali."
              )}
            </h2>

            {/* CTA Buttons */}
            <div className='flex items-center gap-4'>
              <Button
                onClick={handleCTAClick}
                text='Saral Now'
                icon={
                  <img
                    src={Arrow.src}
                    alt='Arrow icon'
                    // className='w-4 h-4'
                  />
                }
              />

              <Button
                onClick={() => setIsColorCodingActive(!isColorCodingActive)}
                text={
                  isColorCodingActive
                    ? "Turn Off Color Coding"
                    : "Try Color Coding"
                }
                className={
                  isColorCodingActive
                    ? ""
                    : "!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
                }
              />
            </div>
          </div>
          <div className=''>
            <img
              src={HeroImage.src}
              alt='Hero Image'
              className='w-[32rem] h-[35rem]'
            />
          </div>
        </div>

        {/* HOME FEATURE LIST SECTION */}
        <div className='mt-15'>
          <div className='text-center mb-10'>
            <h1 className='mb-4'>What you can do with Saral</h1>
            <h2>
              Tools that make reading simpler, calmer, and more personal — all
              designed for neurodiverse readers.
            </h2>
          </div>
          <div className='mt-20 flex items-center px-6 justify-around'>
            <FeatureCard
              className='bg-blue'
              title='Listen while you read'
              description='Saral reads aloud with word-by-word highlighting for smoother comprehension.'
              icon={
                <img
                  src={Volume.src}
                  alt='Volume icon'
                  className='w-12 h-12'
                />
              }
            />
            <FeatureCard
              className='bg-pink'
              title='Easily spot confusing letters'
              description='Highlight letter pairs like b/d, p/q, and 6/9 to reduce confusion while reading.'
              icon={
                <img
                  src={Paint.src}
                  alt='Volume icon'
                  className='w-12 h-12'
                />
              }
            />
            <FeatureCard
              className='bg-yellow'
              title='Read at your own pace'
              description='Adjust letter spacing, line height, and paragraph gaps to match your style.'
              icon={
                <img
                  src={Rular.src}
                  alt='Volume icon'
                  className='w-12 h-12'
                />
              }
            />
          </div>
        </div>

        {/* QUOTE SECTION */}
        <div>
          <Quote
            text='Reading should be accessible to everyone, regardless of their learning
          differences.'
          />
        </div>

        {/* TESTOMONIAL Section */}
        <div className='mt-15 text-center mb-16'>
          <h1>What our users say</h1>
          <div className='flex mt-15 justify-around'>
            <TestomonialCard
              className='bg-pink'
              testimonial='Reading used to make me tired and confused, especially with letters like b and d. But Saral makes it so much easier.'
            />
            <TestomonialCard
              className='bg-yellow'
              testimonial='Reading used to make me tired and confused, especially with letters like b and d. But Saral makes it so much easier.'
            />
            <TestomonialCard
              className='bg-blue'
              testimonial='Reading used to make me tired and confused, especially with letters like b and d. But Saral makes it so much easier.'
            />
          </div>
        </div>
      </div>
    </>
  );
}
