import { Component, OnInit } from '@angular/core';
import { ChartData, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  // Datos a mostrar
  // labels refleja los valores del eje horizontal
  public datos: ChartData = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A' ,
        backgroundColor: '#ffc300'
      },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ],
        label: 'Series B',
        backgroundColor: '#00ff74'
      }
    ]
  };

  // Opciones de configuración
  // El gráfico se adaptará al tamaño de la pantalla
  // El valor minimo del eje Y será 0 y el máximo 100
  public opciones: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
        max: 100
      }
    }
  };

  // Tipo de gráfico
  public tipo: ChartType = 'bar';
  
  constructor() {
   }

  ngOnInit() {
  }

}
