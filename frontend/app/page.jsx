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
        <div className='flex flex-col md:flex-row items-center md:items-start pt-6 md:pt-20 justify-center md:justify-evenly gap-8 md:gap-50 min-h-[30rem] md:h-[42rem] px-4 md:px-15'>
          <div className='w-full md:w-2/5 px-4 md:ml-10 py-5 md:py-10 text-center md:text-left'>
            <h1 className='mb-4 text-3xl md:text-4xl'>
              Where reading becomes easier.
            </h1>
            <h2 className='mb-6 md:mb-4 text-lg md:text-xl'>
              {renderColorCodedText(
                "Supportive tools for dyslexia, ADHD, and autism with customizable text, color-coded letters, and read-aloud in English and Nepali."
              )}
            </h2>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4'>
              <Button
                onClick={handleCTAClick}
                text='Saral Now'
                icon={
                  <img
                    src={Arrow.src}
                    alt='Arrow icon'
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
          <div className='mt-6 md:mt-0'>
            <img
              src={HeroImage.src}
              alt='Hero Image'
              className='w-[90%] max-w-[24rem] md:w-full md:max-w-[42rem] h-auto md:h-[35rem] mx-auto md:mx-0'
            />
          </div>
        </div>

        {/* HOME FEATURE LIST SECTION */}
        <div className='mt-8 md:mt-15 px-4'>
          <div className='text-center mb-8 md:mb-10'>
            <h1 className='mb-3 md:mb-4 text-2xl md:text-3xl'>
              What you can do with Saral
            </h1>
            <h2 className='text-lg px-4'>
              Tools that make reading simpler, calmer, and more personal — all
              designed for neurodiverse readers.
            </h2>
          </div>
          <div className='mt-10 md:mt-20 flex flex-col md:flex-row items-center gap-8 md:gap-4 px-4 md:px-6 justify-around'>
            <FeatureCard
              className='bg-blue w-full md:w-auto'
              title='Listen while you read'
              description='Saral reads aloud with word-by-word highlighting for smoother comprehension.'
              icon={
                <img
                  src={Volume.src}
                  alt='Volume icon'
                  className='w-10 h-10 md:w-12 md:h-12'
                />
              }
            />
            <FeatureCard
              className='bg-pink w-full md:w-auto'
              title='Easily spot confusing letters'
              description='Highlight letter pairs like b/d, p/q, and 6/9 to reduce confusion while reading.'
              icon={
                <img
                  src={Paint.src}
                  alt='Paint icon'
                  className='w-10 h-10 md:w-12 md:h-12'
                />
              }
            />
            <FeatureCard
              className='bg-yellow w-full md:w-auto'
              title='Read at your own pace'
              description='Adjust letter spacing, line height, and paragraph gaps to match your style.'
              icon={
                <img
                  src={Rular.src}
                  alt='Ruler icon'
                  className='w-10 h-10 md:w-12 md:h-12'
                />
              }
            />
          </div>
        </div>

        {/* QUOTE SECTION */}
        <div className='my-12 md:my-16'>
          <Quote text='Reading should be accessible to everyone, regardless of their learning differences.' />
        </div>

        {/* TESTIMONIAL Section */}
        <div className='mt-8 md:mt-15 text-center mb-16 px-4'>
          <h1 className='text-2xl md:text-3xl mb-8'>What our users say</h1>
          <div className='flex flex-col md:flex-row gap-8 md:gap-4 mt-8 md:mt-15 justify-around'>
            <TestomonialCard
              className='bg-pink w-full md:w-auto'
              testimonial='Reading used to make me tired and confused, especially with letters like b and d. But Saral makes it so much easier.'
            />
            <TestomonialCard
              className='bg-yellow w-full md:w-auto'
              testimonial='Reading used to make me tired and confused, especially with letters like b and d. But Saral makes it so much easier.'
            />
            <TestomonialCard
              className='bg-blue w-full md:w-auto'
              testimonial='Reading used to make me tired and confused, especially with letters like b and d. But Saral makes it so much easier.'
            />
          </div>
        </div>
      </div>
    </>
  );
}
