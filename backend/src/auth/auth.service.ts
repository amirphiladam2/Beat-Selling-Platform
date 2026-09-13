import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2'
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService:UsersService,
        private readonly jwtService:JwtService,
    ){}

    async validateUser(email:string,password:string){
        const user = await this.usersService.findByEmail(email);

        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await argon2.verify(
            user.password,
            password
        );

        if(!passwordValid){
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload={
            sub:user.id,
            email:user.email,
            role:user.role,
        }
        const accessToken = await this.jwtService.signAsync(payload);
        return{access_token:accessToken}
    }
}
