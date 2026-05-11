import BlurText from '../../animations/blurtext'
import TextType from '../../animations/typetext'
import AnimatedContent from '../../animations/fadein'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className="mx-auto flex flex-col justify-center items-center min-h-screen text-center pt-10 bg-gradient-to-br from-blue-50 to-indigo-100 md:px-0 px-4 cursor-default">

            <h1 className="text-3xl sm:text-4xl md:text-7xl spline spline-bold sm:flex">
                <BlurText className='justify-center' delay={50} text="Selamat Datang di" />
                <BlurText text=" JiwaRek" className="text-blue-600 md:justify-around justify-center" delay={400} />
            </h1>

            <TextType initialDelay={1600} text="Ambil Assessment Sekarang untuk Masa Depan yang Lebih Baik" className="sm:text-md md:text-2xl md:mt-6 mt-3 px-4.5 md:px-0" />

            <AnimatedContent delay={5.5}>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-1.5 mt-4 md:mt-7'>
                    <Link to="/assessment">
                        <button className="px-6 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 xl:mr-4 mr-1 hover:scale-105 transition-transform duration-300 hover:cursor-pointer text-md">
                            Mulai Assessment
                        </button>
                    </Link>

                    <Link to="/materials">
                        <button className="px-6 py-4 bg-gray-200 text-black rounded-full hover:bg-gray-300 hover:scale-105 transition-transform duration-300 hover:cursor-pointer text-md">
                            Baca Materi
                        </button>
                    </Link>
                </div>

            </AnimatedContent>

        </div>
    )
}

export default Hero