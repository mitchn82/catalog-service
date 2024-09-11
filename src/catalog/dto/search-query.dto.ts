import { IsString, MinLength } from "class-validator";

export class SearchQueryDto {
  @MinLength(3)
  @IsString()
  q: string;
}