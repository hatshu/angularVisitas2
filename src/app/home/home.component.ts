import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mensaje: string;
  constructor() { }

  ngOnInit() {
  }

  onAction(): void {
  this.mensaje = 'hola';
  }

}
