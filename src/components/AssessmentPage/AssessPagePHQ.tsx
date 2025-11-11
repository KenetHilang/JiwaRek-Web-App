import { useState } from 'react';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsDepression } from './Questions/AssessmentQs';
import { sendAssessmentEmail } from '../../utils/emailService';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPagePHQ() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [userName, setUserName] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const handleAnswer = (answer: string) => {
        let calculatedWeight = 0;
        
        if (answer === 'Tidak pernah') {
            calculatedWeight = 0;
        } else if (answer === 'Beberapa hari') {
            calculatedWeight = 1;
        } else if (answer === 'Lebih dari separuh waktu yang dimaksud') {
            calculatedWeight = 2;
        } else if (answer === 'Hampir setiap hari') {
            calculatedWeight = 3;
        } else if (answer === 'Sangat tidak sulit') {
            calculatedWeight = 0;
        } else if (answer === 'Sedikit sulit') {
            calculatedWeight = 1;
        } else if (answer === 'Sangat sulit') {
            calculatedWeight = 2;
        } else if (answer === 'Luar biasa sulit') {
            calculatedWeight = 3;
        }

        const newAnswer: Answer = {
            questionIndex: currentQuestionIndex,
            answer,
            weight: calculatedWeight
        };

        setAnswers(prev => [...prev, newAnswer]);

        
    if (currentQuestionIndex < AssessmentQuestionsDepression.length - 1) {
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
        if (score <= 4) {
            return {
                level: 'Rendah',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                description: 'Anda tidak menunjukkan tanda-tanda depresi. Tetap jaga kesehatan mental Anda dengan pola hidup sehat.'
            };
        } else if (score <= 9) {
            return {
                level: 'Ringan',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-300',
                description: 'Anda menunjukkan tanda-tanda depresi ringan. Kurangi stres dan berikan waktu untuk diri sendiri.'
            };
        } else if (score <= 14) {
            return {
                level: 'Sedang',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                description: 'Anda menunjukkan tanda-tanda depresi sedang. Pertimbangkan untuk berkonsultasi dengan profesional kesehatan mental.'
            };
        } else if (score <= 19) {
            return {
                level: 'Sedang Berat',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Anda menunjukkan tanda-tanda depresi sedang berat. Pertimbangkan untuk mencari bantuan profesional.'
            };
        }
        else {
            return {
                level: 'Berat',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-300',
                description: 'Anda menunjukkan tanda-tanda depresi berat. Segera cari bantuan profesional.'
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
            assessmentType: 'PHQ-9 Depression Screening',
            score: score.toString(),
            maxScore: '27',
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
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:mt-10 mt-16">
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">Assessment Selesai!</h2>
                                <p className="text-sm text-gray-600">Terima kasih telah menyelesaikan assessment kesehatan mental</p>
                            </div>

                            <div className={`${interpretation.bgColor} ${interpretation.borderColor} border-2 rounded-xl p-5 mb-4`}>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Hasil Assessment Anda</h3>
                                <div className="text-3xl font-bold mb-1 text-gray-800">{score}/27</div>
                                <div className={`text-base font-semibold ${interpretation.color} mb-2`}>
                                    Tingkat Depresi: {interpretation.level}
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
                                <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Email berhasil dikirim!</span>
                                    </div>
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
                    question={AssessmentQuestionsDepression[currentQuestionIndex].question}
                    options={AssessmentQuestionsDepression[currentQuestionIndex].options}
                    weight={AssessmentQuestionsDepression[currentQuestionIndex].weight}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={AssessmentQuestionsDepression.length}
                    onAnswer={handleAnswer}
                />            
            </div>
        </>
    );
}

export default assessmentPagePHQ;