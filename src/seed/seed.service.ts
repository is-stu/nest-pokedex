import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @Inject(PokemonService)
    private readonly pokemonService: PokemonService,
  ) {}

  async executeSeed() {
    const pokemonsToInsert: CreatePokemonDto[] = [];
    await this.pokemonService.deleteAllPokemons();

    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonsToInsert.push({ name, no });
    });

    await this.pokemonService.createPokemonsBySeed(pokemonsToInsert);
    return `Seed successfully executed`;
  }
}
