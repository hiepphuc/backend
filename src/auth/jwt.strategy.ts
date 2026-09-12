import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SUPABASE_JWT_SECRET!,
        });
    }

    async validate(payload: any) {
        // Payload là cục data Supabase nhét trong Token. 'sub' chính là User ID.
        return { userId: payload.sub, email: payload.email };
    }
}