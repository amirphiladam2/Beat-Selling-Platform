import { Body, Controller, Get, Post, UseGuards, Param, Query, Patch,Delete, ParseIntPipe } from '@nestjs/common';
import { BeatsService } from './beats.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateBeatDto } from './dto/create-beat.dto';
import { GetBeatsDto } from './dto/get-beats.dto';
import { UpdateBeatDto } from './dto/update-beat-dto';

@Controller('beats')
export class BeatsController {
    constructor(private readonly beatsService: BeatsService) { }

    @Post()
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() createBeatDto: CreateBeatDto) {
        return this.beatsService.create(createBeatDto)
    }

    @Get()
    findAll(@Query() query: GetBeatsDto) {
        return this.beatsService.findAll(query)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.beatsService.findOne(Number(id));
    }
    @Patch(':id')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBeatDto: UpdateBeatDto,
    ) {
        return this.beatsService.update(id, updateBeatDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.beatsService.remove(id);
    }

}
