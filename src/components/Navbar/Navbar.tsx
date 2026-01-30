import { HamburgerMenu } from '@/components';

function Navbar() {
  return (
    <nav className="bg-markdown-zinc-800 flex items-center">
      <HamburgerMenu />
      <div className="flex w-full items-center justify-between p-4">
        <div>
          <h1>Markdown</h1>
        </div>
        <div>
          <button>Save Changes</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
