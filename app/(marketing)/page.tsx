import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Medal } from 'lucide-react';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import Link from 'next/link';

const headingFont = localFont({
  src: '../../public/fonts/font.woff2',
});

const textFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          headingFont.className
        )}
      >
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full">
          <Medal className="h-6 w-6 mr-2" />
          No 1 task management
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          Taskify helps team move
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-t from-fuchsia-600 to-pink-600 text-white  p-2 px-4 rounded-md pb-4 w-fit">
          work forward.
        </div>
      </div>

      <div
        className={cn(
          'text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto',
          textFont.className
        )}
      >
        Collaborate, manage projects, reach new productivity peaks. From high
        rises to the home office, the way your team works is unique - accomplish
        all with taskify.
      </div>
      <Button className="mt-6">
        <Link href="/sign-up">Get Taskify for free</Link>
      </Button>
    </div>
  );
}
