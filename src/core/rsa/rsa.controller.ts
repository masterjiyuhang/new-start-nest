import { Controller } from '@nestjs/common';
import { RsaService } from './rsa.service';

@Controller('rsa')
export class RsaController {
  constructor(private readonly rsaService: RsaService) {}
}
