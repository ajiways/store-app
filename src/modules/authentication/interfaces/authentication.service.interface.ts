import { RegisterResponseDTO } from '../dto/register-response.dto';
import { RegisterDTO } from '../dto/register.dto';

export interface AuthenticationServiceInterface {
  register(dto: RegisterDTO): Promise<RegisterResponseDTO>;
}
