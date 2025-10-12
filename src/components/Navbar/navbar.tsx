import { useState } from 'react';
import logo from '../../assets/jiwarek_logo.png'
import AnimationEffect from '../../animations/fadein';
import { Link } from 'react-router-dom';

const navLinks = [
    { name: 'Assessments', href: '/assessment' },
    { name: 'Materials', href: '/materials' },
    { name: 'Contact', href: '/contact'},
];

function navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <AnimationEffect reverse={true} delay={0.3}>
            <nav className='fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 z-50 transition-all duration-300'>
                <div className='container mx-auto px-4 py-3'>
                    <div className='flex justify-between items-center'>
                    
                        <div className='flex items-center space-x-3 group'>
                            <div className='relative'>
                                <img 
                                    className='h-[30px] object-contain transition-transform duration-300 group-hover:scale-110' 
                                    src={logo} 
                                    alt="JiwaRek Logo" 
                                />
                            </div>
                        </div>

                        
                        <div className='hidden md:flex items-center space-x-1'>
                            {navLinks.map((link, index) => (
                                <Link key={link.name} to={link.href} className='group relative px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50'>
                                    <span className='flex items-center space-x-2'>
                                        <span>{link.name}</span>
                                    </span>
                                </Link>
                            ))}
                            
    
                        </div>

                        
                        <button
                            onClick={toggleMenu}
                            className='md:hidden relative w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300'
                            aria-label='Toggle menu'
                        >
                            <div className='relative w-5 h-5'>
                                <span className={`absolute block h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'top-2 rotate-45' : 'top-1'}`} style={{width: '20px'}}></span>
                                <span className={`absolute block h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-2'}`} style={{width: '20px'}}></span>
                                <span className={`absolute block h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'top-2 -rotate-45' : 'top-3'}`} style={{width: '20px'}}></span>
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className='py-4 space-y-2 border-t border-gray-100'>
                            {navLinks.map((link, index) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className='flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-2'
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <span className='font-medium'>{link.name}</span>
                                </a>
                            ))}
                            <div className='pt-4 px-4'>
                                <button className='w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg'>
                                    Mulai Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </AnimationEffect>
    );
}

export default navbar;