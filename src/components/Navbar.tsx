'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';

interface NavbarProps {
 activeSection: string;
 navItems: string[];
 onNavItemClick: (sectionId: string) => void;
}

export function Navbar({ activeSection, navItems, onNavItemClick }: NavbarProps) {
 const [menuOpen, setMenuOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [showAdminLink, setShowAdminLink] = useState(false);
 const { theme } = useAppContext();

 useEffect(() => {
   const handleScroll = () => {
     setScrolled(window.scrollY > 50);
   };

   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => {
   const keysPressed: { [key: string]: boolean } = {};

   const handleKeyDown = (e: KeyboardEvent) => {
     keysPressed[e.key] = true;

     if (keysPressed['Control'] && keysPressed['Shift'] && e.key === 'A') {
       setShowAdminLink(true);
     }
   };

   const handleKeyUp = (e: KeyboardEvent) => {
     delete keysPressed[e.key];
   };

   window.addEventListener('keydown', handleKeyDown);
   window.addEventListener('keyup', handleKeyUp);

   return () => {
     window.removeEventListener('keydown', handleKeyDown);
     window.removeEventListener('keyup', handleKeyUp);
   };
 }, []);

 const handleLogoDoubleClick = () => {
   window.location.href = '/admin';
 };

 const bgColor = scrolled
   ? theme === 'dark' ? 'bg-gray-800' : 'bg-primary'
   : theme === 'dark' ? 'bg-gray-900' : 'bg-white';

 const textColor = scrolled || theme === 'dark'
   ? 'text-white'
   : 'text-primary';

 return (
   <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${bgColor} ${scrolled ? 'shadow-lg' : ''}`}>
     <div className="container mx-auto px-4">
       <div className="flex justify-between items-center py-4">
         <div className="flex items-center">
           <Link href="/">
             <Image
               src="/logo.jpg"
               alt="IPA Las Encinas Logo"
               width={40}
               height={40}
               className="mr-3 rounded-full cursor-pointer"
               onDoubleClick={handleLogoDoubleClick}
             />
           </Link>
           <h1 className={`text-lg md:text-2xl font-bold ${textColor} hidden lg:inline`}>
             IPA Las Encinas
           </h1>
         </div>

         <nav className="hidden md:flex space-x-6">
           {navItems.map((item) => (
             <button
               key={item}
               onClick={() => onNavItemClick(item.toLowerCase())}
               className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                 activeSection === item.toLowerCase()
                   ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-primary text-white'
                   : `${textColor} hover:bg-primary hover:text-white`
               }`}
             >
               {item}
             </button>
           ))}
         </nav>

         <button
           onClick={() => setMenuOpen(!menuOpen)}
           className={`md:hidden focus:outline-none ${textColor}`}
           aria-label="Toggle menu"
         >
           <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
             <path d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
           </svg>
         </button>
       </div>

       {menuOpen && (
         <nav className={`md:hidden py-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
           {navItems.map((item) => (
             <button
               key={item}
               onClick={() => {
                 onNavItemClick(item.toLowerCase());
                 setMenuOpen(false);
               }}
               className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                 activeSection === item.toLowerCase()
                   ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-primary text-white'
                   : `${theme === 'dark' ? 'text-white' : 'text-primary'} hover:bg-primary hover:text-white`
               }`}
             >
               {item}
             </button>
           ))}
           {showAdminLink && (
             <Link href="/admin" passHref>
               <span
                 onClick={() => setMenuOpen(false)}
                 className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                   theme === 'dark' ? 'text-white' : 'text-primary'
                 } hover:bg-primary hover:text-white cursor-pointer`}
               >
                 Admin
               </span>
             </Link>
           )}
         </nav>
       )}
     </div>
   </header>
 );
}

