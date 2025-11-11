import { useState } from 'react';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsSRQ } from './Questions/AssessmentQs';
import { sendAssessmentEmail } from '../../utils/emailService';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPageSRQ() {
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

        
    if (currentQuestionIndex < AssessmentQuestionsSRQ.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 100);
        } else {
            setTimeout(() => {
                setIsCompleted(true);
            }, 800);
        }
    };

    const calculateScore = () => {
        return answers.reduce((total, answer) => total + answer.weight, 0);
    };

    const getScoreInterpretation = (score: number) => {
        if (score < 6) {
            return {
                level: 'Normal',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                description: 'Anda tidak mengalami gangguan mental emosional atau distres psikologis yang signifikan. Tetap jaga kesehatan mental Anda dengan pola hidup sehat.'
            };
        } else {
            return {
                level: 'Berpotensi Mengalami Gangguan',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Anda menunjukkan tanda-tanda gangguan mental emosional atau distres psikologis. Sangat disarankan untuk berkonsultasi dengan profesional kesehatan mental untuk evaluasi lebih lanjut.'
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
            assessmentType: 'SRQ-20 Mental Health Screening',
            score: score.toString(),
            maxScore: '20',
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
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 mt-12">
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">Assessment Selesai!</h2>
                                <p className="text-sm text-gray-600">Terima kasih telah menyelesaikan SRQ-20 assessment</p>
                            </div>

                            <div className={`${interpretation.bgColor} ${interpretation.borderColor} border-2 rounded-xl p-5 mb-4`}>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Hasil Assessment Anda</h3>
                                <div className="text-3xl font-bold mb-1 text-gray-800">{score}/20</div>
                                <div className={`text-base font-semibold ${interpretation.color} mb-2`}>
                                    Status: {interpretation.level}
                                </div>
                                <p className="text-sm text-gray-700">{interpretation.description}</p>
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

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Ulangi Assessment
                                </button>
                                <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300">
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
            <div className="mt-16">
                <Questioncard
                    question={AssessmentQuestionsSRQ[currentQuestionIndex].question}
                    options={AssessmentQuestionsSRQ[currentQuestionIndex].options}
                    weight={AssessmentQuestionsSRQ[currentQuestionIndex].weight}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={AssessmentQuestionsSRQ.length}
                    onAnswer={handleAnswer}
                />
            </div>
        </>
    );
}

export default assessmentPageSRQ;