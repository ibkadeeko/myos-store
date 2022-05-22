import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { TransformToLowerCase } from './dto.util';

export class userDto {
  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  @IsEmail()
  @TransformToLowerCase()
  email: string;

  @IsNotEmpty({ message: `$property is a required field` })
  @IsString()
  @MinLength(8)
  password: string;
}
