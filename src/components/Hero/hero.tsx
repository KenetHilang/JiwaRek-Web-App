import React from 'react'
import BlurText from '../../animations/blurtext';
import TextType from '../../animations/typetext';

function Hero() {
    return (
        <div className="container mx-auto flex flex-col justify-center items-center h-screen text-center">
            <h1 className="text-4xl font-bold mb-1 md:flex ">
                <BlurText text="Selamat Datang di" />
                <BlurText text=" JiwaRek" className="text-blue-600 md:justify-around justify-center" delay={800} />
            </h1>

            <TextType text="Ambil Assessment Sekarang untuk Masa Depan yang Lebih Baik" className="text-lg " />

            <div>
                <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 xl:mr-4 mr-1">
                    Mulai Assessment
                </button>

                <button className="mt-4 px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300">
                    Baca Materi
                </button>
            </div>

        </div>
    );
}

export default Hero;