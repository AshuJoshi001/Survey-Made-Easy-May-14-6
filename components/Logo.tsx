import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Logo() {
  return (
    <Link href={"/"} 
    className="inline-block font-bold text-2xl sm:text-3xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text hover:cursor-pointer"
    title="Survey Made Easy"> Survey Made Easy</Link>
  );
}

export default Logo;

