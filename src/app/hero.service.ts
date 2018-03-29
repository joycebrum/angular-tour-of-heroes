import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// importa a lista de herois em mock-heroes e a classe Hero

@Injectable()
export class HeroService{

  private heroesUrl = 'api/heroes';
  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  //get heroes from the server
  getHeroes(): Observable<Hero[]> {//retorna um Observable para poder ser assíncrono
    //mostrar uma mensagem antes de procurar pelo herois
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }
  /getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: buscando heroi id=${id}`);
    return of( (this.http.get<Hero[]>(this.heroesUrl)).find(hero=> hero.id === id));
  }

  private log(message: string)
  {
    this.messageService.add('HeroService' + message);
  }
  private handleError<T> (operation = 'operation', result?: T)//perguntar para o leo
  {
    return(error: any) : Observable<T> => {    //T = Hero[]
      //envia o erro para infraestrutura de logging remota
      console.error(error);//imprime no console para debug

      //melhor jeito de transformar o erro para consumo do usuário
      this.log(`${operation} failed: ${error.message}`);

      //deixa a aplicação continuar retornando um resultado vazio
      return of(result as T);
    };
  }

}
