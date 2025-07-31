"use client";
import Volume from "../media/Volume.svg";
import Paint from "../media/Paint.svg";
import Rular from "../media/Rular.svg";

export default function MobileBottomNavbar({ onSelect }) {
  return (
    <div className='bg-white fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center p-4 shadow-lg h-14 sm:hidden'>
      <div
        onClick={() => onSelect("audio")}
        className='flex items-center justify-center w-12 h-12 rounded-md active:bg-gray-100 cursor-pointer'
      >
        <img
          src={Volume.src}
          alt='Volume'
          className='w-6 h-6'
        />
      </div>

      <span className='w-px h-6 bg-gray-300' />

      <div
        onClick={() => onSelect("typography")}
        className='flex items-center justify-center w-12 h-12 rounded-md active:bg-gray-100 cursor-pointer'
      >
        <img
          src={Rular.src}
          alt='Typography'
          className='w-6 h-6'
        />
      </div>

      <span className='w-px h-6 bg-gray-300' />

      <div
        onClick={() => onSelect("display")}
        className='flex items-center justify-center w-12 h-12 rounded-md active:bg-gray-100 cursor-pointer'
      >
        <img
          src={Paint.src}
          alt='Display'
          className='w-6 h-6'
        />
      </div>
    </div>
  );
}
