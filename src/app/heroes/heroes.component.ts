import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero'; /** ../ sai da pasta atual */
import { HeroService } from '../hero.service';
import { TableModule } from "primeng/table";
import { LazyLoadEvent } from 'primeng/api';
import { Router } from "@angular/router";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[] = [];
  selectedHeroes: Hero[] = [];

  loadsForScroll: number;
  cols: any[];
  cols1: any[];
  loading: boolean;
  virtualCars: any[];
  totalRecords: number;
  totalRecordsHeroes: number;
  virtualHeroes: Hero[];
  eventTemp: LazyLoadEvent;

  constructor(private heroService: HeroService, private router: Router) { }
  ngOnInit()
  {
    this.getHeroes();
    this.loadsForScroll = 20;
    this.totalRecords = 250000;
    this.cols =[
      {field: 'id', header: 'Id'},
      {field: 'name', header: 'Name'},
    ];
    this.cols1 = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
  ];

  }

  add(name: string): void{
    name = name.trim();
    if(!name){ return; }
    this.heroService.addHero({name} as Hero)
    .subscribe(hero=> {
      this.heroes.push(hero);
      this.totalRecordsHeroes = this.heroes.length;
      this.loadDataOnScroll2(this.eventTemp);
    });
  }

  delete(hero: Hero): void{
    this.heroes = this.heroes.filter(h=> h!==hero);
    this.heroService.deleteHero(hero).subscribe(_ =>{
      this.totalRecordsHeroes = this.heroes.length;
      this.loadDataOnScroll2(this.eventTemp);
    });
  }

  apagar(): void {
    for(let hero of this.selectedHeroes) {
      this.delete(hero);
    }
  }

  search(valuet: string)
  {
    console.log(valuet);
  }

  getHeroes(): void
  {
    //heroes represeta o parâmetro que será recebido pela função (no caso o Hero[] contido no Observable retornado pelo getHeroes)
    this.heroService.getHeroes()
    .subscribe(heroes => {
                            this.heroes = heroes;
                            this.totalRecordsHeroes = heroes.length;
                            this.loadDataOnScroll2(this.eventTemp);
                          }
               );
    //atribui para o heroService a função de buscar a lista de herois
  }
  MudaRota(rowData){
    this.router.navigateByUrl(`/detail/${rowData.id}`);
  }
  Detalhe() {
    if(this.selectedHeroes.length===1)
    {
      this.router.navigateByUrl(`/detail/${this.selectedHeroes[0].id}`);
    }

  }

  loadDataOnScroll2(event: LazyLoadEvent) {
    this.loading = true;
    this.eventTemp = event;
    //compilador reclama pois a principio nao consegue ler de um undefined, mas logo que getHeroes retorna a função volta a funcionar.
    //quando loadsForScrom = 20 não mostra os ultimos 3 números

    //se for undefined ou null nao tenta ler
    if(event.first + this.loadsForScroll>this.totalRecordsHeroes)
    {
      this.virtualHeroes = this.heroes.slice(event.first, this.totalRecordsHeroes);
    }
    else
    {
      this.virtualHeroes = this.heroes.slice(event.first,event.first + this.loadsForScroll);
    }
  }
}
