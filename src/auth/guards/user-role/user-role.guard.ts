import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())

    const request = context.switchToHttp().getRequest();

    const user: User = request.user;

    if (!user) {
      throw new BadRequestException('user no existe');
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
   
    throw new ForbiddenException(`Usuario ${user.fullname} necesita un rol valido: ${validRoles}`)
  }
}
