import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) // Inject the model for mongodb
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    // Verification by NO in the database
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({
        no: id,
      });
    }

    // Verification by mongoId in the database
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    // Verification by name in the database
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: id.toLowerCase(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Cannot find pokemon by the term or id '${id}'`,
      );
    }

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<any> {
    // return await this.pokemonModel.findByIdAndDelete(id);
    const result = await this.pokemonModel.deleteOne({ _id: id });
    if (!result.deletedCount) {
      throw new NotFoundException(`Cannot delete pokemon by the id '${id}'`);
    }
    return;
  }

  async deleteAllPokemons() {
    await this.pokemonModel.deleteMany({});
    return;
  }

  async createPokemonsBySeed(pokemons: CreatePokemonDto[]) {
    await this.pokemonModel.insertMany(pokemons);
    return;
  }

  private handleExceptions(error: any) {
    console.log('error ', error);
    if (error.code === 11000) {
      throw new ConflictException(
        `This pokemon ${JSON.stringify(error.keyValue)} already exists`,
      );
    }
    throw new InternalServerErrorException(`Cannot create pokemon`);
  }
}
