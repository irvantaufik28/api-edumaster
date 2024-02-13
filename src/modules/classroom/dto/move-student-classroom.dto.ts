import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";

class StudentDto {
    @IsUUID()
    id: string;
}

export class MoveStudentClassroomDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StudentDto)
    students: StudentDto[];
    
    name: String
}