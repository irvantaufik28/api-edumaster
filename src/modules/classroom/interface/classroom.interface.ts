import { Classroom } from "@prisma/client";

export interface ClassroomPaginationResult {
  data: Classroom[];
  paging: {
    page: number;
    total_item: number;
    total_page: number;
  };
}

export interface ClassroomResponse {
  data: Classroom;
}
