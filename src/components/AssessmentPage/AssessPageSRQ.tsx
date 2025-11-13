import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsSRQ } from './Questions/AssessmentQs';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPageSRQ() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const navigate = useNavigate();

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
                const score = [...answers, newAnswer].reduce((total, answer) => total + answer.weight, 0);
                const interpretation = getScoreInterpretation(score);
                
                navigate('/assessment/result', {
                    state: {
                        score,
                        maxScore: '20',
                        assessmentType: 'SRQ-20 Mental Health Screening',
                        level: `Tingkat Kesehatan Mental: ${interpretation.level}`,
                        description: interpretation.description,
                        color: interpretation.color,
                        bgColor: interpretation.bgColor,
                        borderColor: interpretation.borderColor,
                        returnPath: '/assessment/srq20'
                    }
                });
            }, 800);
        }
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