import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { JwtStrategy } from './lib/passport/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule {}
