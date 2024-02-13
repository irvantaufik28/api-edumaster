import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateOrDeleteUserRolesDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: String

    @IsNotEmpty()
    @IsNumber()
    role_id: number
}