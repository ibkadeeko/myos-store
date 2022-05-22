import { IsString, IsOptional, IsInt, IsUUID, IsNumberString, IsNotEmpty, IsUrl } from 'class-validator';

export class createProductDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  title: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  description: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsInt()
  quantity: number;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsInt()
  price: number;
}

export class getProductDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  id: string;
}

export class getProductsDto {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  sortOrder: string;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  size: number;
}
