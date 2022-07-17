import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginResponseDTO } from '../dto/login-response.dto';
import { LoginDTO } from '../dto/login.dto';
import { RegisterResponseDTO } from '../dto/register-response.dto';
import { RegisterDTO } from '../dto/register.dto';
import { Public } from '../guards/authentication.guard';
import { AuthenticationServiceInterface } from '../interfaces/authentication.service.interface';
import { RequestInterface } from '../interfaces/request.interface';
import { TokenResponse } from '../interfaces/token.response';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';

@Controller('/auth')
export class AuthenticationController {
  @Inject(AuthenticationService)
  private readonly authService: AuthenticationServiceInterface;

  @Inject()
  private readonly tokenService: TokenService;

  @Public()
  @Post('/register')
  async register(@Body() args: RegisterDTO): Promise<RegisterResponseDTO> {
    return await this.authService.register(args);
  }

  @Public()
  @Post('/login')
  async login(
    @Body() args: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<LoginResponseDTO, 'refreshToken' | 'expiration'>> {
    const res = await this.authService.login(args);

    response.cookie('refreshToken', res.refreshToken);

    return {
      message: res.message,
      status: res.status,
      userId: res.userId,
      token: res.token,
    };
  }

  @Get('/logout')
  async logout(
    @Req() req: RequestInterface,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const refreshToken = req.cookies['refreshToken'];

    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken');

    return true;
  }

  @Get('/refresh')
  async refresh(
    @Req() req: RequestInterface,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<TokenResponse, 'refreshToken' | 'userId'>> {
    const refreshToken = req.cookies['refreshToken'];
    const userId = req.user.id;

    const result = await this.tokenService.refresh(refreshToken, userId);

    res.cookie('refreshToken', result.refreshToken);

    return {
      token: result.token,
      userRoles: result.userRoles,
    };
  }
}
