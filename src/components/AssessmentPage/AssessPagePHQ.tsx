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

    /**
     * Processes and stores the user's answer with calculated weight
     */
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
        if (currentQuestionIndex < AssessmentQuestionsDepression.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const finalScore = answers.reduce((total, answer) => total + answer.weight, 0);
            const interpretation = getScoreInterpretation(finalScore);
            
            navigate('/assessment/result', {
                state: {
                    score: finalScore,
                    maxScore: '30',
                    assessmentType: 'PHQ-9 Depression Screening',
                    level: `Tingkat Depresi: ${interpretation.level}`,
                    description: interpretation.description,
                    color: interpretation.color,
                    bgColor: interpretation.bgColor,
                    borderColor: interpretation.borderColor,
                    returnPath: '/assessment/phq9'
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
     * Determines depression level and recommendations based on score
     */
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
                description: 'Anda menunjukkan tanda-tanda depresi sedang. Pertimbangkan untuk berkonsultasi dengan nomer di bawah ini.'
            };
        } else if (score <= 19) {
            return {
                level: 'Sedang Berat',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Anda menunjukkan tanda-tanda depresi sedang berat. Pertimbangkan untuk menghubungi nomer di bawah ini.'
            };
        }
        else {
            return {
                level: 'Berat',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-300',
                description: 'Anda menunjukkan tanda-tanda depresi berat. Segera hubungi nomer di bawah ini.'
            };
        }
    };

    return (
        <>
            <Navbar currentPage="Assessment" />

            <div className="mt-20 sm:mt-9">
                <Questioncard
                    question={AssessmentQuestionsDepression[currentQuestionIndex].question}
                    options={AssessmentQuestionsDepression[currentQuestionIndex].options}
                    weight={AssessmentQuestionsDepression[currentQuestionIndex].weight}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={AssessmentQuestionsDepression.length}
                    onAnswer={handleAnswer}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    currentAnswer={getCurrentAnswer()}
                    canGoBack={currentQuestionIndex > 0}
                    canGoNext={currentQuestionIndex < AssessmentQuestionsDepression.length}
                />            
            </div>
        </>
    );
}

export default assessmentPagePHQ;
