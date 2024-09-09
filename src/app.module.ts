import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokedex'),
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
