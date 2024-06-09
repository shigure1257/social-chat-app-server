import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class QueryPostDto {
  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  types?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsString()
  @IsOptional()
  query?: string;
}
