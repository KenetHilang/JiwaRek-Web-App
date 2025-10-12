import logo from '../../assets/jiwarek_logo.png'

const navLinks = [
    { name: 'Assessments', href: '#' },
    { name: 'Materials', href: '#' },
    { name: 'Contact', href: '#' },
];

function navbar() {
    return (
        <>
            <nav className='container mx-auto flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50'>
                {/* Logo Section */}
                <img className='w-[100px] ' src={logo} alt="JiwaRek Logo" />

                {/* Navigation Links */}
                <div className='hidden md:block'>
                    <ul className='space-x-4 flex'>
                        {navLinks.map((link) => (
                            <li key={link.name} className='hover:text-blue-500 cursor-pointer'>
                                {link.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default navbar;