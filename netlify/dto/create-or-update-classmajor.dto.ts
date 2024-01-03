import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrUpdateClassMajorDto {
    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString({ message: 'Name should be a string' })
    
    name: String
}