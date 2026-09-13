import { Body, Get, Controller, Param, ParseIntPipe, Post, UseGuards, Patch,Delete } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

@Controller('licenses')

export class LicensesController {
    constructor(private readonly licensesService: LicensesService) { }

    @Post()
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() createLicenseDto: CreateLicenseDto) {
        return this.licensesService.create(createLicenseDto)
    }

    @Patch(':id')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLicenseDto: UpdateLicenseDto,
    ) {
        return this.licensesService.update(id, updateLicenseDto);
    }
    @Get()
    findAll() {
        return this.licensesService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.licensesService.findOne(id);
    }
    @Delete(':id')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.licensesService.remove(id);
    }
}
