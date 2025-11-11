import { useState } from 'react';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsSH } from './Questions/AssessmentQs';
import { sendAssessmentEmail } from '../../utils/emailService';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [userName, setUserName] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const handleAnswer = (answer: string, weight: number) => {
        const newAnswer: Answer = {
            questionIndex: currentQuestionIndex,
            answer,
            weight: answer === 'Ya' ? weight : 0
        };

        setAnswers(prev => [...prev, newAnswer]);

        
    if (currentQuestionIndex < AssessmentQuestionsSH.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 1200);
        } else {
            setTimeout(() => {
                setIsCompleted(true);
            }, 1200);
        }
    };

    const calculateScore = () => {
        return answers.reduce((total, answer) => total + answer.weight, 0);
    };

    const getScoreInterpretation = (score: number) => {
        if (score <= 5) {
            return {
                level: 'Rendah',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                description: 'Tindakan-Tindakan Anda tergolong Aman. Tetap jaga kesehatan mental Anda dengan pola hidup sehat.'
            };
        } else if (score <= 11) {
            return {
                level: 'Sedang',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                description: 'Anda menunjukkan tanda-tanda self-harm ringan. Kurangi stres dan pertimbangkan untuk berkonsultasi dengan profesional kesehatan mental.'
            };
        } else {
            return {
                level: 'Tinggi',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Anda menunjukkan tanda-tanda self-harm serius. Segera cari bantuan profesional.'
            };
        }
    };

    const handleSendEmail = async () => {
        if (!userName) {
            alert('Mohon isi nama Anda');
            return;
        }

        setIsSendingEmail(true);
        const score = calculateScore();
        const interpretation = getScoreInterpretation(score);
        
        const emailData = {
            assessmentType: 'Self-Harm Assessment',
            score: score.toString(),
            maxScore: '22',
            level: interpretation.level,
            description: interpretation.description,
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

    if (isCompleted) {
        const score = calculateScore();
        const interpretation = getScoreInterpretation(score);

        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment Selesai!</h2>
                                <p className="text-gray-600">Terima kasih telah menyelesaikan assessment kesehatan mental</p>
                            </div>

                            <div className={`${interpretation.bgColor} ${interpretation.borderColor} border-2 rounded-xl p-6 mb-6`}>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Hasil Assessment Anda</h3>
                                <div className="text-4xl font-bold mb-2 text-gray-800">{score}/22</div>
                                <div className={`text-lg font-semibold ${interpretation.color} mb-3`}>
                                    Tingkat Stres: {interpretation.level}
                                </div>
                                <p className="text-gray-700">{interpretation.description}</p>
                            </div>

                            {!emailSent && !showEmailForm && (
                                <div className="mb-4">
                                    <button
                                        onClick={() => setShowEmailForm(true)}
                                        className="px-5 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-300 flex items-center gap-2 mx-auto"
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
                                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Kirim Laporan ke Rumah Sakit</h4>
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
                                <div className="mb-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                                    <p className="text-green-700 font-medium text-sm flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Laporan berhasil dikirim ke rumah sakit!
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Ulangi Assessment
                                </button>
                                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300">
                                    Lihat Rekomendasi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Questioncard
                question={AssessmentQuestionsSH[currentQuestionIndex].question}
                options={AssessmentQuestionsSH[currentQuestionIndex].options}
                weight={AssessmentQuestionsSH[currentQuestionIndex].weight}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={AssessmentQuestionsSH.length}
                onAnswer={handleAnswer}
            />
        </>
    );
}

export default assessmentPage;