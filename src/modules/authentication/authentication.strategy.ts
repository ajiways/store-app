import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from '../../common/configuration/configuration.service';
import { TokenService } from './services/token.service';
import { TAuthenticationToken } from './types/token.type';

@Injectable()
export class AuthenticationStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly tokenService: TokenService;

  constructor(configService: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.env.AUTHENTICATION_TOKEN_SECRET,
    });
  }

  async validate(token: TAuthenticationToken) {
    const user = await this.tokenService.validateToken(token);
    if (!user) {
      throw new ForbiddenException(`Invalid token`);
    }
    return user;
  }
}
