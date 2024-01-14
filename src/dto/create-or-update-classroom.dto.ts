import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import "reflect-metadata";
export class CreateOrUpdateClassroomDto {
    @IsNotEmpty()
    @IsString()
    code: string
    
    @IsNotEmpty()
    @IsString()
    level: string
    
    @IsNotEmpty()
    @IsString()
    year_group: string
   
    @IsNotEmpty()
    @IsNumber()
    class_major_id : number
   
}