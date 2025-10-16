import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomNotificationComponent } from './shared/custom-notification/custom-notification.component';
import { CustomModalComponent } from './shared/custom-modal/custom-modal.component';
import { getLocalDataLogged } from './core/utils/storage.utils';
import { existCart, getCart, setCart } from './core/utils/cart.utils';
import { defaultCarrito } from './core/interfaces/app/comprador/usuario.inteface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CustomNotificationComponent, CustomModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'app-demo-genesis';

  private router = inject(Router);

  ngOnInit(): void {
    const data = getLocalDataLogged();

    if (data.vendedor) {
      this.router.navigateByUrl('/tienda');
    } else {
      if (!existCart()) {
        setCart(defaultCarrito());
      } else {
        if (data.usuario?.idUsuario !== getCart().idUsuario)
          setCart(defaultCarrito());
        else
          console.log('existe carrito similar al usuario logeado: ', getCart())
      }
    }
  }
}
