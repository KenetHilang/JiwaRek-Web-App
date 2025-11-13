import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsSH } from './Questions/AssessmentQs';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPage() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);

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
                const score = [...answers, newAnswer].reduce((total, answer) => total + answer.weight, 0);
                const interpretation = getScoreInterpretation(score);
                
                navigate('/assessment/result', {
                    state: {
                        score,
                        maxScore: '22',
                        assessmentType: 'Self-Harm Assessment',
                        level: `Tingkat Risiko: ${interpretation.level}`,
                        description: interpretation.description,
                        color: interpretation.color,
                        bgColor: interpretation.bgColor,
                        borderColor: interpretation.borderColor,
                        returnPath: '/assessment/self-harm'
                    }
                });
            }, 1200);
        }
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