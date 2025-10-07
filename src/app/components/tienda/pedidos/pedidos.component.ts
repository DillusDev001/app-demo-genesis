
import { Component, OnInit } from '@angular/core';
import { defaultVendedor, Vendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true
})
export class PedidosComponent implements OnInit {

  vendedor: Vendedor = defaultVendedor();

  constructor() { }

  ngOnInit(): void {
    const dataLogged = getLocalDataLogged();
    this.vendedor = dataLogged.vendedor ? dataLogged.vendedor : defaultVendedor();
    
  }

}
