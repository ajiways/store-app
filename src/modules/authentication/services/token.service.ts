import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from '../../../common/configuration/configuration.service';
import { UserEntity } from '../../administration/entities/user.entity';
import { RolesServiceInterface } from '../../administration/interfaces/roles.service.interface';
import { UserServiceInterface } from '../../administration/interfaces/user.service.interface';
import { RolesService } from '../../administration/services/roles.service';
import { UserService } from '../../administration/services/user.service';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { RefreshTokenServiceInterface } from '../interfaces/refresh-token.service.interface';
import { TokenResponse } from '../interfaces/token.response';
import { TAuthenticationToken } from '../types/token.type';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class TokenService {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject(UserService)
  private readonly usersService: UserServiceInterface;

  @Inject()
  private readonly configService: ConfigurationService;

  @Inject(RefreshTokenService)
  private readonly refreshTokenService: RefreshTokenServiceInterface;

  @Inject(RolesService)
  private rolesService: RolesServiceInterface;

  async validateToken(token: TAuthenticationToken): Promise<UserEntity | null> {
    try {
      return await this.usersService.findById(token.id);
    } catch (e) {
      return null;
    }
  }

  async generateToken(user: UserEntity, existingToken?: RefreshTokenEntity) {
    const expiresIn = this.configService.env.AUTHENTICATION_TOKEN_EXPIRES_IN;
    const now = Date.now();
    const expiration = new Date(now + expiresIn * 1000);
    const expirationString = expiration.toISOString();

    const payload: TAuthenticationToken = {
      id: user.id,
      login: user.login,
      expiration: expirationString,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.env.REFRESH_AUTHENTICATION_TOKEN_SECRET,
      expiresIn: this.configService.env.REFRESH_AUTHENTICATION_TOKEN_EXPIRES_IN,
    });

    if (existingToken) {
      await this.refreshTokenService.save({
        id: existingToken.id,
        user,
        refreshToken,
      });
    } else {
      await this.refreshTokenService.save({ refreshToken, user });
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.env.AUTHENTICATION_TOKEN_SECRET,
      expiresIn: this.configService.env.AUTHENTICATION_TOKEN_EXPIRES_IN,
    });

    return {
      expiration: expirationString,
      userId: user.id,
      token,
      refreshToken,
    };
  }

  async refresh(
    refreshToken: string | undefined,
    userId: string | undefined,
  ): Promise<TokenResponse> {
    if (!refreshToken || !userId) {
      throw new BadRequestException('User id refresh token was not provided');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.env.REFRESH_AUTHENTICATION_TOKEN_SECRET,
      });
    } catch (e) {
      const existingToken = await this.refreshTokenService.findByUserId(userId);

      if (existingToken) {
        await this.refreshTokenService.delete(existingToken);
      }

      throw new UnauthorizedException(`Refresh token is expired`);
    }

    let existingToken = await this.refreshTokenService.findByRefreshToken(
      refreshToken,
    );

    if (!existingToken) {
      existingToken = await this.refreshTokenService.findByUserId(userId);

      if (!existingToken) {
        throw new UnauthorizedException(`Token isn't valid`);
      }
    }

    const user = await this.usersService.findById(userId);

    const userRoles = await this.rolesService.getUserRoles(user.id);

    const res = await this.generateToken(user, existingToken);

    return {
      ...res,
      userRoles,
    };
  }
}
