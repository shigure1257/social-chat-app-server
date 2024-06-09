import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不得为空' })
  username: string;
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: '密码不得为空' })
  password: string;

  refresh_token: string;
}
