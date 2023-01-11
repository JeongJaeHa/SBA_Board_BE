import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { PayLoad } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: process.env.JWT_SECRET
            })
    }

    async validate(payload: PayLoad, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload)
        if(!user) {
            return done(new UnauthorizedException({message: 'user not exits'}), false)
        }
        return done(null, user)
    }
}