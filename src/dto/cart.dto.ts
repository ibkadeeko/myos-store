import { IsOptional, IsInt, IsUUID, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class addToCartDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  userId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  @IsOptional()
  cartId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  productId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsInt()
  quantity: number;
}

export class getCartDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  userId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  @IsOptional()
  cartId: string;
}

export class removeCartItemDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  userId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  cartId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  cartItemId: string;
}

export class Address {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  street: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  city: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  state: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  country: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  zip: string;
}

export class checkoutCartDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  userId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsUUID()
  cartId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  paymentId: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
}
