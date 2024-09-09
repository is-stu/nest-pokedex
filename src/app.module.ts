import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
      exclude: ['/api*'],
      renderPath: '/',
    }),
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
