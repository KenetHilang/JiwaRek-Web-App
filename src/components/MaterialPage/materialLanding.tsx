import { useState, useEffect } from 'react';
import Navbar from '../Navbar/navbar';
import MaterialCards from './MaterialsCard/materialCards';
import { LifeLine } from 'react-loading-indicators';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";

interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

interface Article {
    source: {
        id: string | null;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

function MaterialLanding() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const articlesPerPage = 9;
    const GetAPI = import.meta.env.VITE_NEWS_API_KEY;

    /**
     * Fetches articles from the News API
     */
    const fetchArticles = async () => {
        try {
            console.log('Fetching articles from:', GetAPI);
            setLoading(true);
            const response = await fetch(GetAPI);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: NewsAPIResponse = await response.json();
            setArticles(data.articles);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    /**
     * Handles page navigation and scrolls to top
     */
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Generates pagination numbers with ellipsis for mobile-friendly display
     */
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (currentPage <= 3) {
                pages.push(2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        
        return pages;
    };

    return (
        <>
        <Navbar currentPage='Materials'  />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 ">
            <div className="text-center bg-blue-400 rounded-b-4xl p-6 sm:p-8 shadow-lg mt-18">
                    <div>
                        <p className="text-lg sm:text-2xl font-semibold mb-1 text-gray-100">Blog</p>
                        <p className="text-3xl md:text-5xl font-bold leading-tight text-gray-100">
                            Articles & Materials
                        </p>
                    </div>
            </div>

            <div className="flex flex-wrap justify-center mt-4">
                {loading && 
                    <div className='flex flex-col items-center justify-center w-full py-12 mt-12'>
                        <LifeLine color="#353a9a" size="medium" text="" textColor="" />
                        <p className='mt-2'>Sedang Memuat...</p>
                    </div>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {currentArticles.map((article, index) => (
                    <MaterialCards 
                        key={`${currentPage}-${index}`}
                        index={index}
                        imageURL={article.urlToImage}
                        author={article.author || "Unknown Author"}
                        title={article.title}
                        description={article.description}
                        link={article.url}
                        publishedDate={new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    />
                ))}
            </div>

            {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-8">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg transition-all ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                            }`}
                            aria-label="Previous page"
                        >
                            <GoArrowLeft className="text-xl" />
                        </button>

                        {getPageNumbers().map((pageNumber, index) => (
                            pageNumber === '...' ? (
                                <span 
                                    key={`ellipsis-${index}`}
                                    className="px-2 py-2 text-gray-500"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(Number(pageNumber))}
                                    className={`px-4 sm:px-4 py-2 rounded-3xl transition-all font-medium ${
                                        currentPage === pageNumber
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg transition-all ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                            }`}
                            aria-label="Next page"
                        >
                            <GoArrowRight className="text-xl" />
                        </button>
                    </div>
                </div>
            )}

            {!loading && !error && articles.length > 0 && (
                <div className="text-center text-gray-600 mb-4">
                    Showing {indexOfFirstArticle + 1} to {Math.min(indexOfLastArticle, articles.length)} of {articles.length} articles
                </div>
            )}
        </div>
        

        </>
    );
}

export default MaterialLanding;