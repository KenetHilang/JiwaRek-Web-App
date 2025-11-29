
import { useState, useEffect } from 'react';

interface QuestionCardProps {
    question: string;
    options: string[];
    weight: number;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (answer: string, weight: number) => void;
    onPrevious?: () => void;
    onNext?: () => void;
    currentAnswer?: string;
    canGoBack?: boolean;
    canGoNext?: boolean;
}

function Questioncard({ 
    question, 
    options, 
    weight, 
    questionNumber, 
    totalQuestions, 
    onAnswer,
    onPrevious,
    onNext,
    currentAnswer,
    canGoBack = false,
    canGoNext = false
}: QuestionCardProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(currentAnswer || null);
    const [isAnswered, setIsAnswered] = useState(!!currentAnswer);

    useEffect(() => {
        setSelectedOption(currentAnswer || null);
        setIsAnswered(!!currentAnswer);
    }, [questionNumber, question, currentAnswer]);

    /**
     * Handles user's option selection and saves the answer
     */
    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsAnswered(true);
        onAnswer(option, weight);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Pertanyaan {questionNumber} dari {totalQuestions}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                            {Math.round((questionNumber / totalQuestions) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
                        {question}
                    </h2>
                    
                    <div className="space-y-4">
                        {options.map((option, index) => (
                            <button 
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full p-4 rounded-xl text-left text-md font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                    selectedOption === option
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-2 border-transparent hover:border-blue-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {selectedOption === option && (
                                        <svg className="w-6 h-6 ml-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {isAnswered && (
                        <div className="mt-6 text-center text-green-600 font-medium animate-fade-in">
                            Jawaban tersimpan!
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                            <button
                                onClick={onPrevious}
                                disabled={!canGoBack}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    canGoBack
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                                }`}
                            >
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Sebelumnya
                                </div>
                            </button>

                            <button
                                onClick={onNext}
                                disabled={!canGoNext || !selectedOption}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    canGoNext && selectedOption
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                                }`}
                            >
                                <div className="flex items-center">
                                    Selanjutnya
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
            </div>
        </div>
    )
}

export default Questioncard;