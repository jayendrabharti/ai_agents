"use client";

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  
  const { data : session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [providers, setProviders] = useState(null);
  

  useEffect(()=>{
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    } 
    setUpProviders();
  },[]);
  
  const pathname = usePathname();

  const navigations = [
    {name: "Agents", href: "/"},
  ]


  return (
    <nav className="transition-colors duration-200 sticky top-0 z-50">
      <div className="mx-auto px-2 sm:px-8 lg:px-16">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-gray-900 dark:text-white text-xl font-bold">3D AI Avatars</span>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigations.map((navigation,index)=>(
                  <Link
                    key={index}
                    href={navigation.href}
                    className={`${pathname == navigation.href?"bg-gray-100 dark:bg-gray-900 text-black dark:text-white":"text-[#555] dark:text-[#aaa]"}  hover:text-black hover:dark:text-white rounded-md px-3 py-2 text-sm font-medium`}
                  >{navigation.name}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto">

                  {session?.user ? (
                    <div className="relative">
                    <button
                      type="button"
                      className="relative flex rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <Image
                      className="h-8 w-8 rounded-full"
                      src={session?.user.image}
                      alt={session?.user.name}
                      width={32}
                      height={32}
                      />
                    </button>

                    {isProfileOpen && (
                      <div
                      className="fixed inset-0 z-0"
                      onClick={() => setIsProfileOpen(false)}
                      ></div>
                    )}

                    <dialog 
                      className={`
                      absolute top-full -translate-x-full  right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 block
                      [&[open]]:scale-100 [&:not([open])]:scale-0  
                      transition-all duration-75 ease-in-out  
                      `}
                      open={isProfileOpen}
                    >
                      
                      <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 rounded dark:hover:bg-gray-700"
                      >
                      Sign out
                      </button>
                    </dialog>
                    </div>
                  ) : (
                    <>
                    {providers && 
                    Object.values(providers).map((provider,index)=>(
                      <button
                      key={index}
                      onClick={()=>signIn(provider.id)}
                      className="rounded-md bg-zinc-700 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:zinc-bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex flex-row"
                      >
                      Sign in with Google

                      <svg className='ml-2' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                    </button>
                    ))
                    }
                    </>
                  )}
                  </div>
                </div>

                {/* Mobile menu */}
        <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigations.map((navigation,index)=>(
              <Link
                key={index}
                href={navigation.href}
                className={`${pathname == navigation.href?"bg-gray-100 dark:bg-gray-900 text-black dark:text-white":"text-[#555] dark:text-[#aaa]"}  hover:text-black hover:dark:text-white rounded-md px-3 py-2 text-sm font-medium block`}
              >{navigation.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}