
import React, { ReactNode } from 'react'
import Logo from '@/components/Logo';
// import ThemeSwitcher from '@/components/ThemeSwitcher';
function Layout({children}:{children:ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen min-w-full 
    bg-background max-h-screen h-screen">
        <nav className='flex justify-between item-center border-b border-border h-[60px] px-4 py-2'>
            <div title="Survey Made Easy" className='pointer-events-none'><Logo/></div>
            {/* <ThemeSwitcher/> */}
        </nav>
        <main className="flex w-full flex-grow">{children}</main>
        </div>
  );
}

export default Layout;