import { useState, useEffect } from 'react';
import Navbar from '../Navbar/navbar';
import MaterialCards from './MaterialsCard/materialCards';

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

    // Calculate pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
        <Navbar currentPage='Materials'  />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 ">
            <div className="w-full max-w-7xl mx-auto pt-20 sm:pt-24 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-1">Blog</h2>
                <h1 className="text-4xl font-bold mb-6">Articles & Materials</h1>
            </div>

            <div className="flex flex-wrap justify-center">
                {loading && <p>Loading articles...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {currentArticles.map((article, index) => (
                    <MaterialCards 
                        key={index}
                        imageURL={article.urlToImage}
                        author={article.author || "Unknown Author"}
                        title={article.title}
                        description={article.description}
                        link={article.url}
                        publishedDate={new Date(article.publishedAt).toLocaleDateString()}
                    />
                ))}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-8">
                    <div className="flex space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded ${
                                currentPage === 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-4 py-2 rounded ${
                                    currentPage === pageNumber
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded ${
                                currentPage === totalPages
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Page Info */}
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