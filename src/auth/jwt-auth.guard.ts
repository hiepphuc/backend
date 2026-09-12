import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('⚠️ LỖI: Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY trong file .env của Backend');
        }

        this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('🚫 TỪ CHỐI: Không tìm thấy Token trong Header');
            throw new UnauthorizedException('Không có quyền truy cập');
        }

        const token = authHeader.split(' ')[1];

        // Gọi SDK của Supabase để kiểm tra Token thay vì tự giải mã
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error || !data.user) {
            console.log('🚫 TỪ CHỐI: Token sai hoặc đã hết hạn ->', error?.message);
            throw new UnauthorizedException('Token không hợp lệ');
        }

        console.log('\n✅ BẢO MẬT: Token hợp lệ - User:', data.user.email);

        // Gắn thông tin user vào request để AuthController sử dụng
        request.user = {
            userId: data.user.id,
            email: data.user.email
        };

        return true;
    }
}