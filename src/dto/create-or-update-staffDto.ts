import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsEmail, IsString, IsDateString, IsUUID, IsNumber, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import "reflect-metadata";


class UserRolesDto {
    @IsNotEmpty()
    @IsNumber()
    role_id: number;
}


export class CreateOrUpdateStaffDto {
    @IsNotEmpty()
    @IsString()
    nik: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    middle_name?: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsDateString()
    birth_date: string;

    @IsNotEmpty()
    @IsString()
    birth_place: string;

    @IsNotEmpty()
    @IsString()
    gender: string;

    @IsOptional()
    @IsString()
    foto_url?: string;

    @IsNotEmpty()
    @IsString()
    religion: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserRolesDto)
    roles: UserRolesDto[]
}