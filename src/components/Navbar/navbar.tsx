import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiPhoneFill, RiQuillPenFill, RiServiceFill } from 'react-icons/ri';
import logo from '../../assets/jiwarek_logo.png';

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavbarProps {
  currentPage?: string;
}

const NAV_LINKS: NavLink[] = [
  { name: 'Assessments', href: '/assessment', icon: <RiServiceFill /> },
  { name: 'Materials',   href: '/materials', icon: <RiQuillPenFill /> },
  { name: 'Contact',     href: '/contact', icon: <RiPhoneFill />},
];

function Navbar({ currentPage }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = NAV_LINKS.map(link => ({
    ...link,
    current: link.name === currentPage,
  }));

  const linkClass = (current: boolean) =>
    `group relative px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 
     transition-all duration-300 hover:bg-blue-50 
     ${current ? 'font-bold bg-blue-50 text-blue-600' : ''}`;

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 z-[100]'>
      <div className='mx-auto px-5 py-3 m-1'>
        <div className='flex justify-between items-center'>

          <img
            onClick={() => window.location.href = '/'}
            className='h-[30px] object-contain cursor-pointer hover:scale-110 transition-transform duration-300'
            src={logo}
            alt="JiwaRek Logo"
          />

          {/* Desktop */}
          <div className='hidden md:flex items-center space-x-2'>
            {links.map(link => (
              <Link key={link.name} to={link.href} className={linkClass(link.current)}>
                <div className={`flex items-center space-x-2 ${link.current ? 'text-blue-600': 'text-gray-700 hover:text-blue-600'}`}>
                  {link.icon && <span>{link.icon}</span>}
                  <span>{link.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className='md:hidden w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300'
            aria-label='Toggle menu'
          >
            <div className='relative w-5 h-5'>
              <span className={`absolute block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'top-2 rotate-45' : 'top-1'}`} />
              <span className={`absolute block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-2'}`} />
              <span className={`absolute block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'top-2 -rotate-45' : 'top-3'}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className='py-4 space-y-2 border-t border-gray-100'>
            {links.map((link, i) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 hover:bg-blue-50 ${link.current ? 'text-blue-600 font-bold': 'text-gray-700 hover:text-blue-600'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {link.icon && <span>{link.icon}</span>}
                <span className='font-medium'>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;