import { Genre } from '../models/Genre.interface';

export class GenresHelper {
  static createGenreVM(genres: string[]): Genre[] {
    return genres.map((genre: string) => {
      return {
        name: genre,
        selected: false,
      };
    });
  }

  static createOriginalModel(genres: Genre[]): string[] {
    return genres.map((genre: Genre) => {
      return genre.name;
    });
  }
}
