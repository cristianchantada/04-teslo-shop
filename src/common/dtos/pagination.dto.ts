import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  
    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // igual a hacer = enableImplicitConversions: true
    limit?: number
    
    @ApiProperty({
        default: 0,
        description: 'How many rows do want to skip'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // igual a hacer = enableImplicitConversions: true
    @Min(0)
    offset?: number;

}