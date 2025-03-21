"use client"
import { useTheme } from '@/utils/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitch = () => {

  const {theme,toggleTheme} = useTheme();

 
  return (
    <button
      className='cursor-pointer border-4 border-solid border-transparent outline outline-5 outline-black dark:outline-white rounded-full flex items-center justify-between relative scale-75 z-20'
      onClick={()=>toggleTheme()}
    >

        <Moon className={`${theme == 'dark'?'text-black dark:text-white':'text-zinc-500 dark:text-zinc-400'} w-8 h-8 p-1 z-10`}/>
      
        <Sun className={`${theme == 'light'?'text-black dark:text-white':'text-zinc-500 dark:text-zinc-400'} w-8 h-8 ml-2 p-1 z-10`}/>

      <div
        className={`absolute bg-zinc-200 dark:bg-zinc-800 border-3 outline outline-5 outline-black dark:outline-white rounded-full h-8 w-8 duration-500 z-0 ${theme=='dark'?'left-0 translate-x-0':'left-full -translate-x-full'}`}
      ></div>

    </button>
  )
}

export default ThemeSwitch;
