import BlurText from '../../animations/blurtext';
import TextType from '../../animations/typetext';
import AnimatedContent from '../../animations/fadein';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className="mx-auto flex flex-col justify-center items-center min-h-screen text-center pt-10 bg-gradient-to-br from-blue-50 to-indigo-100 md:px-0 px-4">

            <h1 className="text-4xl font-bold mb-1 md:flex">
                <BlurText className='justify-center' delay={50} text="Selamat Datang di" />
                <BlurText text=" JiwaRek" className="text-blue-600 md:justify-around justify-center" delay={400} />
            </h1>

            <TextType initialDelay={1600} text="Ambil Assessment Sekarang untuk Masa Depan yang Lebih Baik" className="text-lg mt-1" />

            <AnimatedContent delay={5.5}>
                <Link to="/assessment">
                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 xl:mr-4 mr-1 hover:scale-105 transition-transform duration-300 hover:cursor-pointer">
                        Mulai Assessment
                    </button>
                </Link>

                <Link to="/materials">
                    <button className="mt-4 px-7 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 hover:scale-105 transition-transform duration-300 hover:cursor-pointer">
                        Baca Materi
                    </button>
                </Link>
            </AnimatedContent>

        </div>
    );
}

export default Hero;