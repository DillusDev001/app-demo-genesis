
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TiendaMenuComponent } from './tienda-menu/tienda-menu.component';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css'],
  standalone: true,
  imports: [RouterModule, TiendaMenuComponent]
})
export class TiendaComponent {

}
