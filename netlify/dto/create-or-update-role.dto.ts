import { IsNotEmpty } from "class-validator";

export class CreateOrUpdateRoleDto {
    @IsNotEmpty()
    name: String
}