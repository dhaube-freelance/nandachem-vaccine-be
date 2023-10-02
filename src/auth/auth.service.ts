import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRY_TIME, REFRESH_TOKEN_EXPIRY_TIME } from './consts';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string, remember?: boolean) {
    const user = await this.userService.findOne({ email });

    if (!user?.password || !bcrypt.compareSync(password, user?.password)) {
      let errorMessage = 'incorrect username or password';

      if (!user?.password) errorMessage = 'user not found';

      throw new BadRequestException(errorMessage);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      remember,
    };
    return this.generateTokens(payload, remember);
  }

  async refresh(prevRefreshToken?: string) {
    try {
      const { id, email, role, remember } = await this.jwtService.verifyAsync(
        prevRefreshToken,
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );
      return this.generateTokens({ id, email, role, remember }, remember);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async generateTokens(
    payload: { id: number; email: string; role: string; remember?: boolean },
    remember?: boolean,
  ) {
    const refreshTokenExpiryTimeInHours = remember
      ? REFRESH_TOKEN_EXPIRY_TIME * 24 * 7
      : REFRESH_TOKEN_EXPIRY_TIME;

    return {
      user: payload,
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: `${ACCESS_TOKEN_EXPIRY_TIME}s`,
        secret: process.env.ACCESS_TOKEN_SECRET,
      }), // one minute
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: `${refreshTokenExpiryTimeInHours}h`,
        secret: process.env.REFRESH_TOKEN_SECRET,
      }), // two days
      remember,
    };
  }
}
