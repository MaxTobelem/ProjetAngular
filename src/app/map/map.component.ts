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
  public departementName: string;
  public departementprix: number;

  public options: any = {
      layers: [
          tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: 'Max TOBELEM'
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
      this.departementprix = null;
      this.departementName = null;
      this.layers = [];
      this.selectedLegendInfos = [];
      this.selectedLegendColorGradient = [
          '#BC0000',
          '#FF1919',
          '#FF5900',
          '#FF5900',
          '#FF5900',
          '#FF5900',
          '#FF5900',
          '#FF9C00',
          '#FFE500',
          '#EFF9CE',
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

      this.layers[0].eachLayer((currentdepartement) => {
          currentdepartement.setStyle({
              fillColor: this.getColor(currentdepartement.feature.properties.prix),
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
                        value > this.selectedLegendInfos[5] ? this.selectedLegendColorGradient[5] :
                            value > this.selectedLegendInfos[6] ? this.selectedLegendColorGradient[6] :
                                value > this.selectedLegendInfos[7] ? this.selectedLegendColorGradient[7] :
                                    value > this.selectedLegendInfos[8] ? this.selectedLegendColorGradient[8] :
                                        this.selectedLegendColorGradient[9];
  }

  private updateLegendValues(): void {
      let maxValue = 0;
      this.layers[0].eachLayer((currentdepartement) => {
          if (currentdepartement.feature.properties.prix > maxValue) {
              maxValue = currentdepartement.feature.properties.prix;
          }
      });

      const tick = Math.round(maxValue / 11);

      this.selectedLegendInfos = [
          tick * 10,
          tick * 9,
          tick * 8,
          tick * 7,
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
      this.departementName = layer.feature.properties.nom;
      this.departementprix = layer.feature.properties.prix;
      this.ref.detectChanges();
  }

  private resetHighlight(e): void {
      this.layers[0].setStyle(STYLE_INITIAL);
      this.departementName = null;
      this.departementprix = null;
      this.ref.detectChanges();
  }


}
