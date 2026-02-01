import { Button, HamburgerMenu } from '@/components';
import { Trash2 } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-markdown-zinc-800 flex w-full">
      <HamburgerMenu />
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-7.5">
          <div className="hidden lg:block">
            <img src="/assets/logo.svg" alt="markdown logo" loading="lazy" />
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-markdown-gray-600 hidden h-10 w-px lg:block" />
            <div className="flex items-center gap-4">
              <div>
                <img src="/assets/icon-document.svg" alt="icon document" loading="lazy" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-roboto-lightbody text-markdown-zinc-500 hidden md:block">
                  Document Name
                </h1>
                <h2 className="text-roboto-regular text-white">welcome.md</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Trash2 className="hover:text-markdown-orange-500 text-markdown-gray-600 cursor-pointer transition-all duration-200" />
          <Button title="Save Changes" icon="/assets/icon-save.svg" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
