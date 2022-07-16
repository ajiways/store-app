import { HttpStatus, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserServiceInterface } from '../../administration/interfaces/user.service.interface';
import { UserService } from '../../administration/services/user.service';
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
}
