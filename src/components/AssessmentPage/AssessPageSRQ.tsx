import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";
import Questioncard from "./QuestionCard/questioncard";
import { AssessmentQuestionsSRQ } from './Questions/AssessmentQs';
import type { Biodata } from './BiodataForm';


interface Answer {
    questionIndex: number;
    answer: string;
    weight: number;
}

function assessmentPageSRQ() {
    const location = useLocation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const navigate = useNavigate();
    const biodata = (location.state as { biodata?: Biodata } | null)?.biodata;

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
        if (currentQuestionIndex < AssessmentQuestionsSRQ.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const finalScore = answers.reduce((total, answer) => total + answer.weight, 0);
            const interpretation = getScoreInterpretation(finalScore);
            
            navigate('/assessment/result', {
                state: {
                    score: finalScore,
                    maxScore: '20',
                    assessmentType: 'SRQ-20 Mental Health Screening',
                    level: `Tingkat Kesehatan Mental: ${interpretation.level}`,
                    description: interpretation.description,
                    color: interpretation.color,
                    bgColor: interpretation.bgColor,
                    borderColor: interpretation.borderColor,
                    returnPath: '/assessment/srq20',
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
     * Determines mental health status based on score
     */
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
                description: 'Anda menunjukkan tanda-tanda gangguan mental emosional atau distres psikologis. Sangat disarankan untuk berkonsultasi dengan nomor di bawah ini untuk evaluasi lebih lanjut.'
            };
        }
    };

    return (
        <>
            <Navbar />
            <div className="mt-12">
                <Questioncard
                    question={AssessmentQuestionsSRQ[currentQuestionIndex].question}
                    options={AssessmentQuestionsSRQ[currentQuestionIndex].options}
                    weight={AssessmentQuestionsSRQ[currentQuestionIndex].weight}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={AssessmentQuestionsSRQ.length}
                    onAnswer={handleAnswer}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    currentAnswer={getCurrentAnswer()}
                    canGoBack={currentQuestionIndex > 0}
                    canGoNext={currentQuestionIndex < AssessmentQuestionsSRQ.length}
                />
            </div>
        </>
    );
}

export default assessmentPageSRQ;