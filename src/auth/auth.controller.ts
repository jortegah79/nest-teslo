import { Controller, Get, Post, Body, UseGuards, Headers, ParseUUIDPipe, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { GetUSer, RowHeaders, RoleProtected, Auth } from './decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('checkstatus')
  @Auth(ValidRoles.user)  
  checkAuthStatus(   @RowHeaders('authorization') authorizationToken: string){
    return this.authService.checkAuthStatus(authorizationToken);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testinPrivateRoute(
    //@Req()request:Express.Request
    @GetUSer() user: User,
    @GetUSer('email') userMail: User,
    @RowHeaders('authorization') authorizationToken: string[],
    @Headers() head: ParameterDecorator
  ) {
    //console.log(request.user)

    return {
      ok: true,
      message: 'Hola mundo privado',
      user,
      userMail,
      authorizationToken,
      head
    };
  }

  @Get("private2")
  // @SetMetadata('roles',['admin','superuser'])
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testInPrivateRoute2(
    @GetUSer() user: User
  ) {

    return "ruta2";
  }

  @Get("private3")
  @Auth(ValidRoles.user )
  testInPrivateRoute3(
    @GetUSer() user: User
  ) {

    return "ruta2";
  }

}
