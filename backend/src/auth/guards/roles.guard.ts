import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticatedRequest } from "../types/authenticated-request";



@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector:Reflector ){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<('CUSTOMER'|'ADMIN')[]>('roles',[
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiredRoles){
            return true;
        }
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = request.user;

        if(!user||!requiredRoles.includes(user.role)){
            throw new ForbiddenException('Insufficient permissions');
        }
        return true;
    }
}