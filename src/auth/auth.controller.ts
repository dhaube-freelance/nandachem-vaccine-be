import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_EXPIRY_TIME } from './consts';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { email, password, remember } = signInDto;
    const { user, accessToken, refreshToken } = await this.authService.signIn(
      email,
      password,
      remember,
    );

    const expiryTimeInHours = remember
      ? REFRESH_TOKEN_EXPIRY_TIME * 24 * 7
      : REFRESH_TOKEN_EXPIRY_TIME;

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(
        new Date().getTime() + expiryTimeInHours * 60 * 60 * 1000,
      ),
      httpOnly: true,
    });

    res.send({ user, accessToken });
  }

  @Post('logout')
  signOut(@Res() res: Response) {
    res.cookie('refreshToken', '', {
      expires: new Date(new Date().getTime() - 1),
      httpOnly: true,
    });
    res.send();
  }

  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const { user, accessToken, refreshToken, remember } =
      await this.authService.refresh(
        req.cookies['refreshToken'], // previous refresh token
      );

    const expiryTimeInHours = remember
      ? REFRESH_TOKEN_EXPIRY_TIME * 24 * 7
      : REFRESH_TOKEN_EXPIRY_TIME;

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(
        new Date().getTime() + expiryTimeInHours * 60 * 60 * 1000,
      ),
      httpOnly: true,
    });
    res.send({ user, accessToken });
  }
}
