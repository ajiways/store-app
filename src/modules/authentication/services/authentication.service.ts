import {
  BadRequestException,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserServiceInterface } from '../../administration/interfaces/user.service.interface';
import { UserService } from '../../administration/services/user.service';
import { LoginResponseDTO } from '../dto/login-response.dto';
import { LoginDTO } from '../dto/login.dto';
import { RegisterResponseDTO } from '../dto/register-response.dto';
import { RegisterDTO } from '../dto/register.dto';
import { AuthenticationServiceInterface } from '../interfaces/authentication.service.interface';
import { RefreshTokenServiceInterface } from '../interfaces/refresh-token.service.interface';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';

export class AuthenticationService implements AuthenticationServiceInterface {
  @Inject(UserService)
  private readonly userService: UserServiceInterface;

  @Inject()
  private readonly tokenService: TokenService;

  @Inject(RefreshTokenService)
  private readonly refreshTokenService: RefreshTokenServiceInterface;

  public async register(dto: RegisterDTO): Promise<RegisterResponseDTO> {
    const user = await this.userService.save(dto);

    return plainToInstance(RegisterResponseDTO, {
      message: 'Successfully',
      status: HttpStatus.CREATED,
      data: user,
    });
  }

  public async login(dto: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.userService.findOneWhere({ login: dto.login });

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    const passwordMatches = await compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Wrong login or password');
    }

    const tokenData = await this.tokenService.generateToken(user);

    return plainToInstance(LoginResponseDTO, {
      message: 'Successfully',
      status: HttpStatus.OK,
      ...tokenData,
    });
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('To log out log in first');
    }

    const existingToken = await this.refreshTokenService.findByRefreshToken(
      refreshToken,
    );

    if (!existingToken) {
      return;
    }

    await this.refreshTokenService.delete(existingToken);
  }
}
