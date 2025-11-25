import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/navbar';

function AssessChoice() {
    const navigate = useNavigate();

    const assessments = [
        {
            id: 'phq9',
            title: 'PHQ-9 Depression Screening',
            description: 'Asesmen untuk mengukur tingkat depresi dalam 2 minggu terakhir. 10 pertanyaan, estimasi 5 menit.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600',
            hoverColor: 'hover:border-blue-400',
            route: '/assessment/phq9',
            available: true
        },
        {
            id: 'srq20',
            title: 'SRQ-20 Mental Health Screening',
            description: 'Asesmen untuk mendeteksi gangguan mental emosional dan distres psikologis. 20 pertanyaan, estimasi 7 menit.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            iconColor: 'text-purple-600',
            hoverColor: 'hover:border-purple-400',
            route: '/assessment/srq20',
            available: true
        },
        {
            id: 'self-harm',
            title: 'Self-Harm Assessment',
            description: 'Asesmen untuk mengidentifikasi perilaku self-harm dan pikiran bunuh diri. 22 pertanyaan, estimasi 8 menit.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600',
            hoverColor: 'hover:border-red-400',
            route: '/assessment/self-harm',
            available: true
        }
    ];

    const handleChoice = (route: string, available: boolean) => {
        if (available) {
            navigate(route);
        }
    };

    return (
        <>
            <Navbar currentPage="Assessments" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center ">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
                            Pilih Asesmen Anda
                        </h1>
                        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Pilih jenis asesmen kesehatan mental yang ingin Anda ikuti. 
                            Semua hasil bersifat rahasia dan dapat membantu Anda memahami kondisi mental Anda.
                        </p>
                    </div>

                    {/* Assessment Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        {assessments.map((assessment) => (
                            <div
                                key={assessment.id}
                                onClick={() => handleChoice(assessment.route, assessment.available)}
                                className={`${assessment.bgColor} ${assessment.borderColor} ${
                                    assessment.available ? assessment.hoverColor + ' cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-60'
                                } border-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-300 transform sm:hover:scale-105 hover:shadow-xl relative min-h-[240px] sm:min-h-[260px] flex flex-col`}
                            >
                                {!assessment.available && (
                                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gray-800 text-white text-xs px-2 sm:px-3 py-1 rounded-full">
                                        Segera Hadir
                                    </div>
                                )}
                                
                                <div className={`${assessment.iconColor} mb-3 sm:mb-4`}>
                                    {assessment.icon}
                                </div>

                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                                    {assessment.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-600 mb-4 flex-grow">
                                    {assessment.description}
                                </p>

                                {assessment.available && (
                                    <button className="w-full py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-lg font-medium text-sm sm:text-base text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 hover:cursor-pointer">
                                        Mulai Asesmen →
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Info Box */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-3xl mx-auto border-2 border-blue-100">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="text-blue-600 flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Informasi Penting</h4>
                                <ul className="text-gray-600 space-y-1 text-xs sm:text-sm">
                                    <li>• Asesmen ini bukan diagnosis medis profesional</li>
                                    <li>• Hasil dapat membantu Anda memahami kondisi mental Anda</li>
                                    <li>• Jika hasil menunjukkan tingkat tinggi, segera hubungi profesional</li>
                                    <li>• Semua data bersifat anonim dan tidak disimpan</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AssessChoice;
