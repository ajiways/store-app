import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { ConfigurationModule } from '../../common/configuration/configuration.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationService } from '../../common/configuration/configuration.service';
import { AdministrationModule } from '../administration/administration.module';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthenticationStrategy } from './authentication.strategy';
import { RolesGuard } from './guards/roles.guard';
import { TokenService } from './services/token.service';

const controllers = [AuthenticationController];
const services = [
  AuthenticationService,
  TokenService,
  RefreshTokenService,
  AuthenticationGuard,
  AuthenticationStrategy,
  RolesGuard,
];
const modules = [AdministrationModule];

@Module({
  imports: [
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => {
        const { AUTHENTICATION_TOKEN_SECRET, AUTHENTICATION_TOKEN_EXPIRES_IN } =
          configService.env;
        return {
          secret: AUTHENTICATION_TOKEN_SECRET,
          signOptions: {
            expiresIn: AUTHENTICATION_TOKEN_EXPIRES_IN * 1000,
          },
        };
      },
      inject: [ConfigurationService],
    }),
    ...modules,
  ],
  controllers: [...controllers],
  providers: [...services],
  exports: [...services],
})
export class AuthenticationModule {}
