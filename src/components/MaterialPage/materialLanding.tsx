import { useState, useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import MaterialCards from './MaterialsCard/materialCards'
import { LifeLine } from 'react-loading-indicators'
import { GoArrowRight, GoArrowLeft } from "react-icons/go"
import { usePagination } from './Hooks/usePagination'

interface Article {
    source: { id: string | null; name: string }
    author: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    content: string
}

interface NewsAPIResponse {
    status: string
    totalResults: number
    articles: Article[]
}

const ARTICLES_PER_PAGE = 9

function MaterialLanding() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { currentPage, setCurrentPage, totalPages, paginated, start, getPageNumbers } = usePagination(articles, ARTICLES_PER_PAGE)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true)
                const response = await fetch(import.meta.env.VITE_NEWS_API_KEY)
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                const data: NewsAPIResponse = await response.json()
                setArticles(data.articles)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }
        fetchArticles()
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <Navbar currentPage='Materials' />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-12 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center bg-blue-400 rounded-b-4xl p-8 shadow-lg mt-18 mb-8">
                    <p className="text-lg sm:text-2xl font-semibold mb-1 text-blue-100">Blog</p>
                    <p className="text-3xl md:text-5xl spline spline-bold text-white">Articles & Materials</p>
                </div>

                {/* States */}
                {loading && (
                    <div className='flex flex-col items-center justify-center py-24'>
                        <LifeLine color="#353a9a" size="medium" text="" textColor="" />
                        <p className='mt-4 text-gray-500'>Sedang Memuat...</p>
                    </div>
                )}
                {error && (
                    <p className="text-center text-red-500 py-12">Error: {error}</p>
                )}

                {/* Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {paginated.map((article, index) => (
                            <MaterialCards
                                key={`${currentPage}-${index}`}
                                index={index}
                                imageURL={article.urlToImage}
                                author={article.author || 'Unknown Author'}
                                title={article.title}
                                description={article.description}
                                link={article.url}
                                publishedDate={new Date(article.publishedAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 space-x-1 sm:space-x-2 mx-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 cursor-pointer'}`}
                        >
                            <GoArrowLeft className="text-xl" />
                        </button>

                        {getPageNumbers().map((page, i) =>
                            page === '...' ? (
                                <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400">…</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(Number(page))}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer'}`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 cursor-pointer'}`}
                        >
                            <GoArrowRight className="text-xl" />
                        </button>
                    </div>
                )}

                {/* Count */}
                {!loading && !error && articles.length > 0 && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                        Showing {start + 1}–{Math.min(start + ARTICLES_PER_PAGE, articles.length)} of {articles.length} articles
                    </p>
                )}
            </div>
        </>
    )
}

export default MaterialLanding