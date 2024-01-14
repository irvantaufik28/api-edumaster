import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import "reflect-metadata";
export class CreateOrUpdateStudentParentDto {
    @IsOptional()
    @IsUUID()
    student_id?: string;

    @IsNotEmpty()
    @IsString()
    nik: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    relationship: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    job: string;

    @IsNotEmpty()
    @IsString()
    salary: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}