import { Controller, Get, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUSer } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { RowHeaders } from '../common/decorators/row-headers.decorator';


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

  @Get('private')
  @UseGuards(AuthGuard())
  testinPrivateRoute(
    //@Req()request:Express.Request
    @GetUSer() user: User,
    @GetUSer('email') userMail: User,
    @RowHeaders('authorization') authorizationToken: string[],
    @Headers() head:ParameterDecorator
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

}
