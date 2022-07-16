import { BadRequestException, HttpStatus, Inject } from '@nestjs/common';
import { compare } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserServiceInterface } from '../../administration/interfaces/user.service.interface';
import { UserService } from '../../administration/services/user.service';
import { LoginResponseDTO } from '../dto/login-response.dto';
import { LoginDTO } from '../dto/login.dto';
import { RegisterResponseDTO } from '../dto/register-response.dto';
import { RegisterDTO } from '../dto/register.dto';
import { AuthenticationServiceInterface } from '../interfaces/authentication.service.interface';

export class AuthenticationService implements AuthenticationServiceInterface {
  @Inject(UserService)
  private readonly userService: UserServiceInterface;

  public async register(dto: RegisterDTO): Promise<RegisterResponseDTO> {
    console.log(dto);
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

    return plainToInstance(LoginResponseDTO, {
      message: 'Successfully',
      status: HttpStatus.OK,
    });
  }
}
