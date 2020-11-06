import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';

const STYLE_INITIAL = {
  color: '#4974ff',
  fillOpacity: 0.7,
  weight: 2
};

const STYLE_HOVER = {
  weight: 5,
  color: 'white'
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  public regionName: string;
  public regionprix: number;

  public options: any = {
      layers: [
          tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: 'Bastien MAURICE'
          })
      ],
      zoom: 6,
      center: latLng(46.303558, 6.0164252)
  };
  public layers: any[];

  public selectedLegendInfos: number[];
  public selectedLegendColorGradient: string[];


  constructor(
      private http: HttpClient,
      private ref: ChangeDetectorRef
      ) {
      this.regionprix = null;
      this.regionName = null;
      this.layers = [];
      this.selectedLegendInfos = [];
      this.selectedLegendColorGradient = [
          '#ff0000',
          '#ff2e2e',
          '#ff6363',
          '#ff8181',
          '#ffb8b8',
          '#ffdcdc',
      ];


  }


  ngOnInit(): void {
      this.http.get('assets/philippelebg.geojson').subscribe((json: any) => {
           this.layers.push(L.geoJSON(json, {
              style: STYLE_INITIAL,
              onEachFeature: (feature, layer) => {
                  layer.on('mouseover', (e) => this.highlightFeature(e));
                  layer.on('mouseout', (e) => this.resetHighlight(e));
                  // layer.on('click', (e) => this.zoomToFeature(e));
              }
           }));
           this.updateStyleMap();
       });
  }



  public updateStyleMap(): void {
      this.updateLegendValues();

      this.layers[0].eachLayer((currentRegion) => {
          currentRegion.setStyle({
              fillColor: this.getColor(currentRegion.feature.properties.prix),
              fillOpacity: 0.7,
              weight: 2
          });
      });

  }


  private getColor(value: number) {
      return value > this.selectedLegendInfos[0] ? this.selectedLegendColorGradient[0] :
          value > this.selectedLegendInfos[1] ? this.selectedLegendColorGradient[1] :
              value > this.selectedLegendInfos[2] ? this.selectedLegendColorGradient[2] :
                  value > this.selectedLegendInfos[3] ? this.selectedLegendColorGradient[3] :
                      value > this.selectedLegendInfos[4] ? this.selectedLegendColorGradient[4] :
                          this.selectedLegendColorGradient[5];
  }

  private updateLegendValues(): void {
      let maxValue = 0;
      this.layers[0].eachLayer((currentRegion) => {
          if (currentRegion.feature.properties.prix > maxValue) {
              maxValue = currentRegion.feature.properties.prix;
          }
      });

      const tick = Math.round(maxValue / 7);

      this.selectedLegendInfos = [
          tick * 6,
          tick * 5,
          tick * 4,
          tick * 3,
          tick * 2,
          tick
      ];
  }

  public highlightFeature(e): void {
      const layer = e.target;
      layer.setStyle(STYLE_HOVER);
      console.log(layer.feature.properties.nom);
      this.regionName = layer.feature.properties.nom;
      this.regionprix = layer.feature.properties.prix;
      this.ref.detectChanges();
  }

  private resetHighlight(e): void {
      this.layers[0].setStyle(STYLE_INITIAL);
      this.regionName = null;
      this.regionprix = null;
      this.ref.detectChanges();
  }


}
