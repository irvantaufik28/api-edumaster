import { IsBoolean, IsNotEmpty, IsNumber, IsString, validate, validateOrReject } from "class-validator";
import "reflect-metadata";
import { ResponseError } from "../../../error/response-error";
export class CreateOrUpdateClassroomDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  year_group: string;

  @IsNotEmpty()
  @IsNumber()
  class_major_id: number;
}
