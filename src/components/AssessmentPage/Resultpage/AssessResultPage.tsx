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
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Show modal automatically for several high-risk levels
    useEffect(() => {
        if (!state || !state.level) return;

        // Trigger popup for any of these level keywords (case-insensitive)
        const triggers = [
            'berat',
            'tinggi',
            'berpotensi mengalami gangguan'
        ];

        const levelLower = state.level.toLowerCase();
        const shouldShow = triggers.some(t => levelLower.includes(t));
        if (shouldShow) setShowModal(true);
    }, [state]);

    // We'll trap focus inside the modal and prevent background interaction while open.
    const modalRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!showModal) return;

        const previousActive = document.activeElement as HTMLElement | null;

        // Prevent background scrolling
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const modal = modalRef.current;
        const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusable = modal ? Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector)) : [];

        // Focus the first focusable element (the close button)
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
            // Do NOT close on Escape to enforce closing only via the X button
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

    const handleSendEmail = async () => {
        if (!userName) {
            alert('Mohon isi nama Anda');
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

                        <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-5 sm:p-6 mb-4 sm:mb-6`}>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Hasil Assessment Anda</h3>
                            <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-gray-800">{score}/{maxScore}</div>
                            <div className={`text-base sm:text-lg font-semibold ${color} mb-2 sm:mb-3`}>
                                {level}
                            </div>
                            <p className="text-sm sm:text-base text-gray-700">{description}</p>
                        </div>

                        {!emailSent && !showEmailForm && (
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowEmailForm(true)}
                                    className="px-5 py-2 sm:py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-300 flex items-center gap-2 mx-auto text-sm sm:text-base"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Kirim Laporan ke Rumah Sakit
                                </button>
                            </div>
                        )}

                        {showEmailForm && !emailSent && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">Kirim Laporan ke Rumah Sakit</h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSendEmail}
                                            disabled={isSendingEmail}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300 text-sm"
                                        >
                                            {isSendingEmail ? 'Mengirim...' : 'Kirim Laporan'}
                                        </button>
                                        <button
                                            onClick={() => setShowEmailForm(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300 text-sm"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    * Laporan akan dikirim ke rumah sakit untuk evaluasi lebih lanjut
                                </p>
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

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button 
                                onClick={() => navigate(returnPath)}
                                className="px-5 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
                            >
                                Ulangi Assessment
                            </button>
                            <button 
                                onClick={() => navigate('/contact')}
                                className="px-5 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300 text-sm sm:text-base">
                                Hubungi Kami
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for severe result (image + close) */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                    />

                    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Peringatan hasil berat" className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-4 m-4 z-50">
                        <button
                            aria-label="Close popup"
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 rounded-full p-1 focus:outline-none"
                        >
                            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col items-center gap-4">
                            <img src="/popup_warning.png" alt="Peringatan: Hasil Berat" className="w-full h-auto rounded-lg" />
                            <div className="text-center">
                                <h4 className="font-bold text-lg">Kamu Menpatkan Hasil Berat</h4>
                                <p className="text-sm text-gray-600">Hubungi layanan kesehatan profesional, bila diperlukan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AssessResultPage;