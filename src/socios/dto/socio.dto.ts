import { IsNotEmpty, IsString } from 'class-validator';

export class SocioDto {
  @IsString()
  @IsNotEmpty()
  readonly userName: string;
}
