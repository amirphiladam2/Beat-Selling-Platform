import { Controller, Post, Body, Req ,Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-users.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './types/authenticated-request';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.validateUser(
            loginUserDto.email,
            loginUserDto.password,
        )
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthenticatedRequest) {
        return req.user;
    }
    @Get('admin')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    adminOnly() {
        return {
            message: 'Welcome, admin!',
        };
    }
}
