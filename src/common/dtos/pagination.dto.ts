import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // igual a hacer = enableImplicitConversions: true
    limit?: number
    
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // igual a hacer = enableImplicitConversions: true
    @Min(0)
    offset?: number;

}