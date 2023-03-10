import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto'; 
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { PayLoad } from './security/payload.interface';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

  async registerUser(newUser: UserDto): Promise<UserDto> {
    let emailFind : UserDto = await this.userService.findByFields({
      where: {email: newUser.email}
    })

    if(emailFind) {
      throw new BadRequestException('email already registered');
    }

    let nicknameFind : UserDto = await this.userService.findByFields({
      where: {nickname: newUser.nickname }
    })

    if(nicknameFind) {
      throw new BadRequestException('nickname already registered');
    }
    this.userService.save(newUser);
    return Object.assign({"message": "register success"})
  }

  async validateUser(UserDto: UserDto): Promise<Object | undefined> {
    const userFind: User = await this.userService.findByFields({
      where: { email: UserDto.email }
    })

    if(!userFind) {
      throw new BadRequestException('Email not exists');
    }

    const validatePassword = await bcrypt.compare(UserDto.password, userFind.password);
    if(!userFind || !validatePassword) {
      throw new UnauthorizedException()
    }
    const payload: PayLoad = { id: userFind.id, nickname: userFind.nickname}
    return {
      accessToken: this.jwtService.sign(payload),
      nickname: userFind.nickname,
      message: 'login success'
    }
  } 

  async tokenValidateUser(payload: PayLoad): Promise<UserDto | undefined> {
    return await this.userService.findByFields({
      where: { id: payload.id }
    })
  }
}
