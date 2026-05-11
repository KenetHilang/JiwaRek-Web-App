import { useState } from 'react'

export function usePagination<T>(items: T[], perPage: number) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(items.length / perPage)
    const start = (currentPage - 1) * perPage
    const paginated = items.slice(start, start + perPage)

    const getPageNumbers = (): (number | '...')[] => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }

    return { currentPage, setCurrentPage, totalPages, paginated, start, getPageNumbers }
}