import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero'; /** ../ sai da pasta atual */
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[];
  constructor(private heroService: HeroService) { }

  ngOnInit()
  {
    this.getHeroes();
  }

  getHeroes(): void
  {
    //heroes represeta o parâmetro que será recebido pela função (no caso o Hero[] contido no Observable retornado pelo getHeroes)
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
    //atribui para o heroService a função de buscar a lista de herois
  }

}
