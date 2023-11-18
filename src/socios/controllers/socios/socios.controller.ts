import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/interceptors';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from '../../../socios/dto/socio.dto';
import { Socio } from '../../entities/socio.entity';
import { SociosService } from '../../../socios/services/socios/socios.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('socios')
export class SociosController {
  constructor(private readonly sociosService: SociosService) {}

  @Get()
  async findAll() {
    return await this.sociosService.findAll();
  }

  @Get(':socioId')
  async findOne(@Param('socioId') socioId: string) {
    return await this.sociosService.findOne(socioId);
  }

  @Post()
  async create(@Body() socioDto: SocioDto) {
    const socio: Socio = plainToInstance(Socio, socioDto);
    return await this.sociosService.create(socio);
  }

  @Put(':socioId')
  async update(@Param('socioId') socioId: string, @Body() socioDto: SocioDto) {
    const socio: Socio = plainToInstance(Socio, socioDto);
    return await this.sociosService.update(socioId, socio);
  }

  @Delete(':socioId')
  @HttpCode(204)
  async delete(@Param('socioId') socioId: string) {
    return await this.sociosService.delete(socioId);
  }
}
