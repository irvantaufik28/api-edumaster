import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUrl, ValidateNested } from "class-validator";
import "reflect-metadata";
import { CreateOrUpdateStudentParentDto } from "./create-or-update-studentParent.Dto";
import { Type } from "class-transformer";
export class createOrUpdateStudentDto {
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    middle_name?: string;

    @IsString()
    last_name: string;

    @IsString()
    birth_date: string;

    @IsString()
    birth_place: string;

    @IsString()
    birth_certificate_no: string;

    @IsString()
    family_identity_no: string;

    @IsString()
    gender: string;

    @IsString()
    register_year: string;

    @IsString()
    religion: string;

    @IsString()
    origin_academy: string;

    @IsUrl()
    foto_url: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrUpdateStudentParentDto)
    student_parents: CreateOrUpdateStudentParentDto[];
}