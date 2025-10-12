import FuzzyText from "../../animations/fuzzytext";

function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <FuzzyText color="#155dfc" fontSize="10rem" fontWeight={900} fontFamily="Arial, sans-serif" baseIntensity={0.2} hoverIntensity={0.6} enableHover={true}>
                404 
            </FuzzyText>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-10">Halaman Tidak Ditemukan</h1>
            <p className="text-gray-600 mt-2">Maaf, halaman yang Anda cari tidak ada.</p>
            <a href="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Kembali ke Beranda
            </a>
        </div>
    );
}

export default ErrorPage;