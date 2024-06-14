"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { CiSettings } from "react-icons/ci";
import Profile from "./Profile";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border">
        <TabsTrigger className="mr-3 mt-2 ml-2" value="light" onClick={() => setTheme("light")} title="Light Mode">
          <SunIcon className="h-[4.9] w-[4.9]" />
        </TabsTrigger>
        <TabsTrigger className="mr-3 " value="dark" onClick={() => setTheme("dark")} title="Dark Mode">
          <MoonIcon className="h-[4.9] w-[4.9] rotate-90 transition-all dark:rotate-0" />
        </TabsTrigger>
        <TabsTrigger className="mr-3 mt-2 ml-2" value="setting" title="Setting">
          <CiSettings onClick={handleOpenPopup} className="h-[4.9] w-[4.9] rotate-90 transition-all dark:rotate-0" />
        </TabsTrigger>
      </TabsList>
      {/* <Profile isOpen={isPopupOpen} onClose={handleClosePopup} /> */}
      <Profile isOpen={isPopupOpen} onClose={handleClosePopup} />

    </Tabs>
  );
}

export default ThemeSwitcher;


// "use client";
// import React, {useEffect, useState} from "react";
// import {useTheme} from "next-themes";
// import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
// import { SunIcon,MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
// import { CiSettings } from "react-icons/ci";
// import Profile from "./Profile";


// function ThemeSwitcher() {
//     const {theme, setTheme}=useTheme();
//     const [mounted, setMounted] = useState(false);
//     const [isPopupOpen, setPopupOpen] = useState(false);

//     useEffect( ()=>{
//         setMounted(true);
//     }, []);


//     if(!mounted) return null;


//   const handleOpenPopup = () => {
//     setPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setPopupOpen(false);
//   };
//   return (
//     <Tabs defaultValue={theme}>
//         <TabsList className="border">
//             <TabsTrigger className="mr-3 mt-2 ml-2" value="light" onClick={()=> setTheme("light")} title="Light Mode">
//                 <SunIcon className="h-[1.2rem] w-[1.6 rem]" />
//             </TabsTrigger>
//             <TabsTrigger className="mr-3 " value="dark" onClick={()=> setTheme("dark")} title="Dark Mode">
//                 <MoonIcon className="h-[1.2rem] w-[1.2 rem] rotate-90 transition-all dark:rotate-0"  />
//             </TabsTrigger>
//             <TabsTrigger className="mr-3 mt-2 ml-2" value="setting" title="Setting">
//             <CiSettings onClick={handleOpenPopup}  className="h-[1.2 rem] w-[1.2 rem] rotate-90 transition-all dark:rotate-0" />                           
//             <Profile isOpen={isPopupOpen} onClose={handleClosePopup} />
//             </TabsTrigger>
             
//         </TabsList>
//     </Tabs>
//   );
// }

// export default ThemeSwitcher;