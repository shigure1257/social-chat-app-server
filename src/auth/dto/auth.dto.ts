import { IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty({ message: '用户名不得为空' })
  username: string;
  @IsNotEmpty({ message: '密码不得为空' })
  password: string;
}
