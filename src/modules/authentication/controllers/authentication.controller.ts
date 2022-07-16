import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginResponseDTO } from '../dto/login-response.dto';
import { LoginDTO } from '../dto/login.dto';
import { RegisterResponseDTO } from '../dto/register-response.dto';
import { RegisterDTO } from '../dto/register.dto';
import { AuthenticationServiceInterface } from '../interfaces/authentication.service.interface';
import { AuthenticationService } from '../services/authentication.service';

@Controller('/auth')
export class AuthenticationController {
  @Inject(AuthenticationService)
  private readonly authService: AuthenticationServiceInterface;

  @Post('/register')
  async register(@Body() args: RegisterDTO): Promise<RegisterResponseDTO> {
    return await this.authService.register(args);
  }

  @Post('/login')
  async login(@Body() args: LoginDTO): Promise<LoginResponseDTO> {
    return await this.authService.login(args);
  }
}
