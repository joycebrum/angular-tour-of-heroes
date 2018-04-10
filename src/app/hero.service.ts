import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// importa a lista de herois em mock-heroes e a classe Hero
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HeroService{

  private heroesUrl = 'api/heroes'; //url para web api
  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  //get heroes from the server
  getHeroes(): Observable<Hero[]> {//retorna um Observable para poder ser assíncrono
    //mostrar uma mensagem antes de procurar pelo herois
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.handleError('getHeroes', []))
    );
  }
  getHero(id: number): Observable<Hero>
  {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id= ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero (hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((hero:Hero) => this.log(`added hero w/ id= ${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );

  }

  deleteHero(hero: Hero | number): Observable<Hero>{
    const id = typeof hero ==='number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url,httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>(`deleteHero`))
    );
  }

  searchHeroes(term: string) : Observable<Hero[]> {
    if(!term.trim()) {
      return(of([]));
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add('HeroService ' + message);
  }
  private handleError<T> (operation = 'operation', result?: T) {//result é um parâmetro opcional;
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
