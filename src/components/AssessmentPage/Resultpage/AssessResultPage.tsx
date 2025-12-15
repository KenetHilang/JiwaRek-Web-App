import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../Navbar/navbar";
import { sendAssessmentEmail } from '../../../utils/emailService';

interface LocationState {
    score: number;
    maxScore: string;
    assessmentType: string;
    level: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    returnPath: string;
}

function AssessResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showModal, setShowModal] = useState(false);

    /**
     * Displays warning modal for high-risk assessment results
     */
    useEffect(() => {
        if (!state || !state.level) return;

        const triggers = ['berat', 'tinggi', 'berpotensi mengalami gangguan'];
        const levelLower = state.level.toLowerCase();
        const shouldShow = triggers.some(t => levelLower.includes(t));
        if (shouldShow) setShowModal(true);
    }, [state]);

    /**
     * Manages focus trapping and accessibility for the warning modal
     */
    const modalRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!showModal) return;

        const previousActive = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const modal = modalRef.current;
        const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusable = modal ? Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector)) : [];

        if (focusable.length) focusable[0].focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previousActive) previousActive.focus();
        };
    }, [showModal]);

    if (!state || state.score === undefined) {
        navigate('/assessment');
        return null;
    }

    const { score, maxScore, assessmentType, level, description, color, bgColor, borderColor, returnPath } = state;

    /**
     * Sends assessment results to hospital via email
     */
    const handleSendEmail = async () => {
        if (!userName || !phoneNumber || !address) {
            alert('Mohon isi semua data (nama, nomor HP, dan alamat)');
            return;
        }

        setIsSendingEmail(true);
        
        const emailData = {
            assessmentType: assessmentType,
            score: score.toString(),
            maxScore: maxScore,
            level: level,
            description: description,
            userName: userName,
            phoneNumber: phoneNumber,
            address: address,
            date: new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
        };

        const success = await sendAssessmentEmail(emailData);
        setIsSendingEmail(false);
        
        if (success) {
            setEmailSent(true);
            setShowEmailForm(false);
            alert('Laporan assessment telah dikirim ke rumah sakit!');
        } else {
            alert('Gagal mengirim laporan. Silakan coba lagi atau screenshot hasil Anda.');
        }
    };

    // WhatsApp button visibility logic
    const showWhatsAppButton = ['tinggi', 'berat', 'sangat berat', 'berpotensi', 'berisiko']
        .some(keyword => level.toLowerCase().includes(keyword));

    // WhatsApp message and URL
    const whatsappMessage = encodeURIComponent(
        `Halo, saya baru saja menyelesaikan ${assessmentType} dengan hasil:\n\n` +
        `Skor: ${score}/${maxScore}\n` +
        `Level: ${level}\n\n` +
        `Saya ingin berkonsultasi lebih lanjut mengenai hasil ini.`
    );

    const whatsappUrl = `https://wa.me/6281347275307?text=${whatsappMessage}`;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-20 sm:pt-24">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
                        <div className="mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Assessment Selesai!</h2>
                            <p className="text-sm sm:text-base text-gray-600">Terima kasih telah menyelesaikan {assessmentType}</p>
                        </div>

                        <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-5 sm:p-6 mb-2 sm:mb-4`}>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Hasil Assessment Anda</h3>
                            <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-gray-800">{score}/{maxScore}</div>
                            <div className={`text-base sm:text-lg font-semibold ${color} mb-2 sm:mb-3`}>
                                {level}
                            </div>
                            <p className="text-sm sm:text-base text-gray-700">{description}</p>
                        </div>

                        {/* Action Buttons - Side by Side */}
                        {!emailSent && !showEmailForm && (
                            <div className="mb-3 flex gap-2 justify-center flex-wrap">
                                <button
                                    onClick={() => setShowEmailForm(true)}
                                    className="group flex items-center px-4 py-3 bg-green-600 text-white rounded-4xl font-medium hover:bg-green-700 transition-all duration-300 text-sm sm:text-base cursor-pointer shadow-lg hover:shadow-xl hover:cursor-pointer"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out ">
                                    &nbsp;Kirim Laporan
                                    </span>
                                </button>

                                {/* WhatsApp Button - Icon only, expands on hover */}
                                {showWhatsAppButton && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center px-4 py-3 bg-green-500 text-white rounded-4xl font-medium hover:bg-green-600 transition-all duration-300 text-sm sm:text-base cursor-pointer shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                        </svg>
                                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
                                        &nbsp;Chat WhatsApp
                                        </span>
                                    </a>
                                )}
                            </div>
                        )}

                        {showEmailForm && !emailSent && (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/50" onClick={() => setShowEmailForm(false)} />
                                
                                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 m-4 z-50">
                                    <button
                                        onClick={() => setShowEmailForm(false)}
                                        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 focus:outline-none cursor-pointer transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="mb-6 sm:mt-0 mt-8">
                                        <h4 className="sm:text-xl text-md font-bold text-gray-800 mb-2">Kirim Laporan ke Rumah Sakit</h4>
                                        <p className="text-sm text-gray-600">Mohon isi data diri Anda untuk melanjutkan</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                placeholder="Masukkan Nama Lengkap"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                                            <input
                                                type="tel"
                                                placeholder="Contoh: 081234567890"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                                            <textarea
                                                placeholder="Masukkan Alamat Lengkap"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm resize-none placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleSendEmail}
                                                disabled={isSendingEmail}
                                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-sm"
                                            >
                                                {isSendingEmail ? 'Mengirim...' : 'Kirim Laporan'}
                                            </button>
                                            <button
                                                onClick={() => setShowEmailForm(false)}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300 text-sm"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-4 text-center">
                                        Laporan akan dikirim ke rumah sakit untuk evaluasi lebih lanjut
                                    </p>
                                </div>
                            </div>
                        )}

                        

                        {emailSent && (
                            <div className="mb-4 p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                <div className="flex items-center justify-center gap-2 text-green-700">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">Laporan berhasil dikirim ke rumah sakit!</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:mr-9">
                            <button 
                                onClick={() => navigate(returnPath)}
                                className="px-5 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base cursor-pointer"
                            >
                                Ulangi Assessment
                            </button>
                            <button 
                                onClick={() => navigate('/contact')}
                                className="px-5 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300 text-sm sm:text-base cursor-pointer">
                                Hubungi Kami
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" />

                    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Peringatan hasil berat" className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-4 m-4 z-50">
                        <button
                            aria-label="Close popup"
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 rounded-full p-1 focus:outline-none cursor-pointer"
                        >
                            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div className="flex flex-col items-center gap-4">
                            <img src="/popup_warning.png" alt="Peringatan: Hasil Berat" className="w-full h-auto rounded-lg" 
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AssessResultPage;