import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent  {
  public nbEntree: number;
  public allData: any[];
  public layout: object;
  public config: object;
  public compteur: 0;
  selectedValue: string;

  departementForm = this.formBuilder.group({
    departement: '' ,
  });

  constructor(
      private http: HttpClient,
      private formBuilder: FormBuilder,
  ) {

      this.nbEntree = 0;
      this.allData = [];
      this.allData.push({
          type: 'scatter',
          x: [],
          y: [],
          marker: {
              color: 'red'
          },
          name: 'Prix (€)',
          legendgroup: '0',
      });
      this.layout = {
          title: 'Prix moyen au m2',
          xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
          visible: false,
         },
          autosize: true,
          mode: 'lines+markers',
      };
      this.config = {
          responsive: true
      };

      this.loadData();
  }


  public loadData(): void {
      console.log(this.departementForm.value.departement);
      this.http.get('assets/data.csv', { responseType: 'text' })
          .subscribe(data => {
              this.parseXmlFile(data, this.departementForm.value.departement);
          });
  }


  private parseXmlFile(csvContent: string, dep: string): void {
      const csvContentByLine = csvContent.split('\n');

      const xTempDep: string[] = [];
      const yTempPrix: number[] = [];

      csvContentByLine.forEach((csvLine) => {
          // Verif ligne non vide, inséré par Pandas
          if (csvLine.length && csvLine !== '') {
              const currentLine = csvLine.split(';');
              if (currentLine[0] === dep){
              xTempDep.push(String(currentLine[1]));
              yTempPrix.push(Number(currentLine[4]));
              this.nbEntree++;
              this.compteur++;
            }
          }
      });

      this.allData[0].x = xTempDep;
      this.allData[0].y = yTempPrix;
  }
}
