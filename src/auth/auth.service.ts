import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({ username: username });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const plainPassword = await this.decryptPassword(password);
    // const plainPassword = password;
    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(
      plainPassword,
      // password,
      hashedPassword,
    );
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 注册功能
   * @param user
   * @returns
   */
  async register(user: CreateUserDto) {
    const userExists = await this.usersService.findOne({
      username: user.username,
    });
    if (userExists) {
      throw new BadRequestException('用户已存在');
    }
    const hashedPassword = await this.hashData(
      this.decryptPassword(user.password),
    );
    // const hashedPassword = await this.hashData(user.password);
    const newUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      code: 200,
      msg: '创建成功',
      data: tokens,
    };
  }

  /**
   * 登录功能
   * @param user
   * @returns
   */
  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      code: 200,
      msg: '登录成功',
      data: { ...tokens, id: user.id, name: user.username, email: user.email },
    };
  }

  /**
   * 登出功能
   * @param userId
   * @returns
   */
  async logout(userId: number) {
    return this.usersService.update({
      where: {
        id: userId,
      },
      data: { refresh_token: null },
    });
  }

  /**
   * 刷新Token
   * @param userId
   * @param refreshToken
   * @returns
   */
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne({ id: userId });
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenIsMatch = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (!refreshTokenIsMatch) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private decryptPassword(password: string) {
    const buffer = Buffer.from(password, 'base64');
    const privateKey = this.configService.get('PRIVKEY_KEY');
    const plain = crypto
      .privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        buffer,
      )
      .toString('utf-8');
    return plain;
  }

  private async hashData(plain: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(plain, salt);
    return hashedPassword;
  }

  private async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hashedRefreshToken,
      },
    });
  }
}
