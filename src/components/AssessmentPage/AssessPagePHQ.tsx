import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsDepression } from './Questions/AssessmentQs';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPagePHQ() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);

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
                const score = [...answers, newAnswer].reduce((total, answer) => total + answer.weight, 0);
                const interpretation = getScoreInterpretation(score);
                
                navigate('/assessment/result', {
                    state: {
                        score,
                        maxScore: '27',
                        assessmentType: 'PHQ-9 Depression Screening',
                        level: `Tingkat Depresi: ${interpretation.level}`,
                        description: interpretation.description,
                        color: interpretation.color,
                        bgColor: interpretation.bgColor,
                        borderColor: interpretation.borderColor,
                        returnPath: '/assessment/phq9'
                    }
                });
            }, 1200);
        }
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

    return (
        <>
            {/* Back Button */}
            <Navbar currentPage="Assessment" />


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