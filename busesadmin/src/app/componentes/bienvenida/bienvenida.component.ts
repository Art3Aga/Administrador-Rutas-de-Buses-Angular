import { LocalstorageService } from './../../servicios/localstorage.service';
import { ActivatedRoute } from '@angular/router';
import { FechaTiempoService } from './../../modelos/fecha-tiempo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit {
  hoy: any;
  fecha: Date;
  tiempo: string;
  titulo: string;
  usuario: any;
  constructor(public fechatiempo: FechaTiempoService, public storageService: LocalstorageService) { }

  ngOnInit() {
    this.fechatiempo.Fecha();
    this.validarTiempo();
  }
  validarTiempo() {
    this.storageService.VerificarStorage('usuario');
    this.usuario = this.storageService.getLocalStorage;
    if (this.usuario) {
      if (Number(this.fechatiempo.getTiempo24H.split(':')[0]) >= 0 && Number(this.fechatiempo.getTiempo24H.split(':')[0]) < 12) {
        this.titulo = `Buenos Días ${this.usuario.usuario}`;
      }
      if (Number(this.fechatiempo.getTiempo24H.split(':')[0]) >= 12 && Number(this.fechatiempo.getTiempo24H.split(':')[0]) < 18) {
        this.titulo = `Buenas Tardes ${this.usuario.usuario}`;
      }
      if (Number(this.fechatiempo.getTiempo24H.split(':')[0]) >= 18 && Number(this.fechatiempo.getTiempo24H.split(':')[0]) < 24) {
        this.titulo = `Buenas Noches ${this.usuario.usuario}`;
      }
    }
  }

}
