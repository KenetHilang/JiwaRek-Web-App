import { useState } from 'react';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsDepression } from './Questions/AssessmentQs';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPagePHQ() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);

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
                bgColor: 'bg-green-60',
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
                bgColor: 'bg-red-60',
                borderColor: 'border-red-300',
                description: 'Anda menunjukkan tanda-tanda depresi berat. Segera cari bantuan profesional.'
            };
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
                                <div className="text-4xl font-bold mb-2 text-gray-800">{score}/30</div>
                                <div className={`text-lg font-semibold ${interpretation.color} mb-3`}>
                                    Tingkat Stres: {interpretation.level}
                                </div>
                                <p className="text-gray-700">{interpretation.description}</p>
                            </div>

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
                question={AssessmentQuestionsDepression[currentQuestionIndex].question}
                options={AssessmentQuestionsDepression[currentQuestionIndex].options}
                weight={AssessmentQuestionsDepression[currentQuestionIndex].weight}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={AssessmentQuestionsDepression.length}
                onAnswer={handleAnswer}
            />
        </>
    );
}

export default assessmentPagePHQ;