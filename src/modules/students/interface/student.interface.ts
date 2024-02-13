import { Student } from "@prisma/client";

export interface StudentPaginationResult {
    data: Student[],
    paging: {
        page: number;
        total_item: number;
        total_page: number;
      };
}