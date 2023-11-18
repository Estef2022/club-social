import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/interceptors';
import { SociosClubsService } from 'src/socios/services/socios-clubs/socios-clubs';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('socios')
export class SociosClubsController {
  constructor(private readonly sociosClubsService: SociosClubsService) {}

  @Post(':socioId/clubs/:clubId')
  // @HttpCode(201)
  async addClubToSocio(
    @Param('socioId') socioId: string,
    @Param('clubId') clubId: string,
  ) {
    return await this.sociosClubsService.addClubToSocio(socioId, clubId);
  }

  @Get(':socioId/clubs')
  async findClubsBySocioId(@Param('socioId') socioId: string) {
    return await this.sociosClubsService.findClubsBySocioId(socioId);
  }

  @Delete(':socioId/clubs/:clubId')
  @HttpCode(204)
  async deleteClubFromSocio(
    @Param('socioId') socioId: string,
    @Param('clubId') clubId: string,
  ) {
    return await this.sociosClubsService.deleteClubFromSocio(socioId, clubId);
  }
}
