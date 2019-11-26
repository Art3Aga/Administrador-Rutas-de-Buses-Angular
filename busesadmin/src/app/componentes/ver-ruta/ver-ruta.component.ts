import { LocalstorageService } from 'src/app/servicios/localstorage.service';
import { BitacoraModelService } from './../../modelos/bitacora-model.service';
import { FechaTiempoService } from './../../modelos/fecha-tiempo.service';
import { AccionesService } from 'src/app/servicios/acciones.service';
import { IRuta } from 'src/app/interfaces/IRuta';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { RutaModelService } from 'src/app/modelos/ruta-model.service';

@Component({
  selector: 'app-ver-ruta',
  templateUrl: './ver-ruta.component.html',
  styleUrls: ['./ver-ruta.component.scss']
})
export class VerRutaComponent implements OnInit {
  mapa: Mapboxgl.Map;
  latitud: any;
  longitud: any;
  NombreRuta: string;
  NombreRutaAnterior: string;
  ultimaFecha: string;
  imgAnterior: any;
  IsChange: boolean;
  constructor(public dialogRef: MatDialogRef<VerRutaComponent>,
              @Inject(MAT_DIALOG_DATA) public RutaSeleccionada: IRuta,
              public rutamodel: RutaModelService, public accionesService: AccionesService,
              public fechatiempo: FechaTiempoService, public bitacoraModel: BitacoraModelService,
              public storageService: LocalstorageService) { }

  ngOnInit() {
    this.IsChange = false;
    this.imgAnterior = this.RutaSeleccionada['RutaSeleccionada'].imgPath;
    this.fechatiempo.Fecha();
    this.longitud = -88.175347;
    this.latitud = 13.483324;
    this.NombreRuta = this.RutaSeleccionada['RutaSeleccionada'].nombre_ruta;
    this.NombreRutaAnterior = this.NombreRuta;
    this.ultimaFecha = `${this.fechatiempo.getHoy} ${this.fechatiempo.getTiempo12H}`;
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud],
      zoom: 15.63
    });
    this.crearMarcador(this.longitud, this.latitud, 'Parque');
  }
  crearMarcador(lng: number, lat: number, nombre: string) {
    const popup = new Mapboxgl.Popup({ offset: 25 }).setText(nombre);
    const marker = new Mapboxgl.Marker({
      draggable: true
    })
    .setLngLat([lng, lat]).setPopup(popup)
    .addTo(this.mapa);
    marker.on('drag', () => {
      marker.getLngLat();
    });
  }
  verMarcadorParada(lng: any, lat: any) {
    this.mapa.flyTo({
      center: [lng, lat]
    });
  }
  seleccionarImagen(changeImg: any) {
    this.rutamodel.setImgSeleccionada = changeImg.target.files[0];
    this.RutaSeleccionada['RutaSeleccionada'].imgPath = changeImg.target.files[0].name;
  }
  ActualizarRuta() {
    this.RutaSeleccionada['RutaSeleccionada'].fecha_actualizacion = this.ultimaFecha;
    this.rutamodel.ActualizarRuta(this.RutaSeleccionada['RutaSeleccionada']).subscribe(
      data => {
        if (data) {
          this.bitacoraModel.GuardarBitacora(`Se actualizaron los datos de la
          ${this.NombreRuta} por la cuenta de ${this.storageService.getLocalStorage.usuario} el
          ${this.fechatiempo.getHoy} a las ${this.fechatiempo.getTiempo12H}`, 'Actualización de Ruta');
          this.accionesService.ShowMensaje(`${this.NombreRuta} Actualizada Correctamente!`, '', 3000, 'niceMsm', 'top');
          this.rutamodel.MostrarListaRutas();
        }
      },
      error => console.log(error),
    );
    this.IsChange = true;
  }

}
