export interface IPostPutResponse {
  result: number;
  message: string;
}

export interface IPagination {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface IPaginationParams {
  per_page?: number;
  page?: number;
  sort_order?: 'asc' | 'desc';
}

export type ClientType = 'individual' | 'legal';
