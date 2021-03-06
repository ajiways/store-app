import { LoginResponseDTO } from '../dto/login-response.dto';
import { LoginDTO } from '../dto/login.dto';
import { RegisterResponseDTO } from '../dto/register-response.dto';
import { RegisterDTO } from '../dto/register.dto';

export interface AuthenticationServiceInterface {
  logout(refreshToken: string | undefined): Promise<void>;
  register(dto: RegisterDTO): Promise<RegisterResponseDTO>;
  login(dto: LoginDTO): Promise<LoginResponseDTO>;
}
