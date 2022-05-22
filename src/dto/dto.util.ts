import { Transform } from 'class-transformer';

export const TransformToLowerCase = (): PropertyDecorator => {
  return Transform(({ value }) => (value as string).toLowerCase());
};

export const TransformToUpperCase = (): PropertyDecorator => {
  return Transform(({ value }) => (value as string).toUpperCase());
};

export const TransformToNumber = (): PropertyDecorator =>
  Transform(({ value }) => (value === undefined ? (value as undefined) : Number(value)));
