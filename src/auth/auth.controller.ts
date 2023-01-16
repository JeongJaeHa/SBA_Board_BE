import { Controller, Post, Body, Req, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Request, Response  } from 'express';
import { AuthGuard } from './security/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerAccount(@Req() req: Request, @Body() UserDto: UserDto): Promise<any>  {
    return this.authService.registerUser(UserDto)
  }

  @Post('/login')
  async login(@Body() userDto: UserDto, @Res() res:Response): Promise<any> {
    const jwt = await this.authService.validateUser(userDto);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user
  }
} 
