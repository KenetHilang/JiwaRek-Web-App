import BlurText from '../../animations/blurtext';
import TextType from '../../animations/typetext';
import AnimatedContent from '../../animations/fadein';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className="mx-auto flex flex-col justify-center items-center min-h-screen text-center pt-10 bg-gradient-to-br from-blue-50 to-indigo-100 md:px-0 px-4 cursor-default">

            <h1 className="text-7xl spline spline-bold mb-1 md:flex">
                <BlurText className='justify-center' delay={50} text="Selamat Datang di" />
                <BlurText text=" JiwaRek" className="text-blue-600 md:justify-around justify-center" delay={400} />
            </h1>

            <TextType initialDelay={1600} text="Ambil Assessment Sekarang untuk Masa Depan yang Lebih Baik" className="text-2xl mt-6" />

            <AnimatedContent delay={5.5}>
                <Link to="/assessment">
                    <button className="mt-7 px-6 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 xl:mr-4 mr-1 hover:scale-105 transition-transform duration-300 hover:cursor-pointer text-md">
                        Mulai Assessment
                    </button>
                </Link>

                <Link to="/materials">
                    <button className="mt-7 px-6 py-4 bg-gray-200 text-black rounded-full hover:bg-gray-300 hover:scale-105 transition-transform duration-300 hover:cursor-pointer text-md">
                        Baca Materi
                    </button>
                </Link>
            </AnimatedContent>

        </div>
    );
}

export default Hero;