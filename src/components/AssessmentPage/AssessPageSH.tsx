import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsSH } from './Questions/AssessmentQs';
import type { Biodata } from './BiodataForm';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const biodata = (location.state as { biodata?: Biodata } | null)?.biodata;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);

    if (!biodata) {
        navigate('/assessment/biodata', { state: { next: location.pathname } });
        return null;
    }

    /**
     * Processes and stores the user's answer with calculated weight
     */
    const handleAnswer = (answer: string, weight: number) => {
        const newAnswer: Answer = {
            questionIndex: currentQuestionIndex,
            answer,
            weight: answer === 'Ya' ? weight : 0
        };

        setAnswers(prev => {
            const existingIndex = prev.findIndex(a => a.questionIndex === currentQuestionIndex);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newAnswer;
                return updated;
            } else {
                return [...prev, newAnswer];
            }
        });
    };

    /**
     * Advances to the next question or navigates to results page
     */
    const handleNext = () => {
        if (currentQuestionIndex < AssessmentQuestionsSH.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const finalScore = answers.reduce((total, answer) => total + answer.weight, 0);
            const interpretation = getScoreInterpretation(finalScore);
            
            navigate('/assessment/result', {
                state: {
                    score: finalScore,
                    maxScore: '22',
                    assessmentType: 'Self-Harm Assessment',
                    level: `Tingkat Risiko: ${interpretation.level}`,
                    description: interpretation.description,
                    color: interpretation.color,
                    bgColor: interpretation.bgColor,
                    borderColor: interpretation.borderColor,
                    returnPath: '/assessment/self-harm',
                    biodata,
                }
            });
        }
    };

    /**
     * Returns to the previous question
     */
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    /**
     * Retrieves the saved answer for the current question
     */
    const getCurrentAnswer = () => {
        const answer = answers.find(a => a.questionIndex === currentQuestionIndex);
        return answer?.answer;
    };

    /**
     * Determines self-harm risk level based on score
     */
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
                description: 'Anda menunjukkan tanda-tanda self-harm ringan. Kurangi stres dan pertimbangkan untuk berkonsultasi dengan nomor di bawah ini.'
            };
        } else {
            return {
                level: 'Tinggi',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Anda menunjukkan tanda-tanda self-harm serius. Segera hubungi nomor di bawah ini.'
            };
        }
    };

    return (
        <>
            <Navbar />
            <div className="mt-8">
                <Questioncard
                    question={AssessmentQuestionsSH[currentQuestionIndex].question}
                    options={AssessmentQuestionsSH[currentQuestionIndex].options}
                    weight={AssessmentQuestionsSH[currentQuestionIndex].weight}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={AssessmentQuestionsSH.length}
                    onAnswer={handleAnswer}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    currentAnswer={getCurrentAnswer()}
                    canGoBack={currentQuestionIndex > 0}
                    canGoNext={currentQuestionIndex < AssessmentQuestionsSH.length}
                />
            </div>
        </>
    );
}

export default assessmentPage;