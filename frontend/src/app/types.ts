export type Paginator<T> = {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
};
