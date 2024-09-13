import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @Inject(PokemonService)
    private readonly pokemonService: PokemonService,
    @Inject(AxiosAdapter)
    private readonly httpAdapter: AxiosAdapter,
  ) {}

  async executeSeed() {
    const pokemonsToInsert: CreatePokemonDto[] = [];
    await this.pokemonService.deleteAllPokemons();

    const { results } = await this.httpAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonsToInsert.push({ name, no });
    });

    await this.pokemonService.createPokemonsBySeed(pokemonsToInsert);
    return `Seed successfully executed`;
  }
}
