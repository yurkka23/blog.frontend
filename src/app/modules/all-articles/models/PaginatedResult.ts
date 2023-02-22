
export class PaginatedResult<T> {
    result!: T | null;
    pagination!: Pagination | null;
}

export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}