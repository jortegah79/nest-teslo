import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }


  async create(createAuthDto: CreateUserDto) {

    try {

      const { password, ...userData } = createAuthDto;



      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      const newUser = await this.userRepository.save(user);

      //jwt
      const payload = {
        email: newUser.email,
        id: newUser.id
      };
      const token = this.getJwtPayload(payload);
      return token;

      //return user;

    } catch (error) {

      this.handleDBErrors(error);

    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true ,id:true}
    });

    if (!user) {
      throw new UnauthorizedException('El email no se encuentra en el sistema')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException("EL password es incorrecto");
    }

    //JWT
    return this.getJwtPayload({
      email: user.email,
      id: user.id
    });

    return user;

  }
  private getJwtPayload(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    throw new InternalServerErrorException();
  }
}
