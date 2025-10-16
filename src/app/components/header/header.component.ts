import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { deleteLocalStorageData, getLocalDataLogged } from '../../core/utils/storage.utils';
import { HeaderService } from '../../core/services/header.service';
import { DataLocalStorage, defaultDataLocalStorage } from '../../core/interfaces/local/data-local-storage';
import { Carrito, defaultCarrito, defaultUsuario, Usuario } from '../../core/interfaces/app/comprador/usuario.inteface';
import { Vendedor } from '../../core/interfaces/app/vendedor/vendedor.interface';
import { getCart, setCart } from '../../core/utils/cart.utils';
import { FirebaseGenesisService } from '../../core/services/firebase.genesis.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription!: Subscription;
  private headerSubscription!: Subscription;

  private firebaseGenesisService = inject(FirebaseGenesisService);

  dataLocalStorage: DataLocalStorage = defaultDataLocalStorage();
  userLogeado!: Usuario | Vendedor | null;
  cartItemCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.setDataAndCart();

    this.authSubscription = this.authService.isLoggedIn().subscribe(status => {
      // Potentially refresh data on auth status change
    });

    this.headerSubscription = this.headerService.headerAction$.subscribe(action => {
      if (action === 'refreshUser' || action === 'refreshCart') {
        this.setDataAndCart();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.headerSubscription) {
      this.headerSubscription.unsubscribe();
    }
  }

  async setDataAndCart() {
    this.dataLocalStorage = getLocalDataLogged();
    this.userLogeado = this.dataLocalStorage.usuario ? this.dataLocalStorage.usuario : this.dataLocalStorage.vendedor;

    let cart: Carrito;

    if (this.dataLocalStorage.type !== 'vendedor') {
      cart = getCart();
      this.cartItemCount = cart.detalle.reduce((total, item) => total + item.cantidad, 0);
    } else {
      setCart(defaultCarrito())
      this.cartItemCount = 0;
    }
  }

  onClickUsuario() {
    if (this.dataLocalStorage.type !== '') {
      this.router.navigateByUrl('/mi-cuenta');
    } else {
      this.router.navigateByUrl('/auth');
    }
  }

  async onClickLogout() {
    const result = await this.authService.signOut();
    if (result.success) {
      deleteLocalStorageData();
      this.setDataAndCart(); // Refresca los datos del usuario y el carrito
      this.router.navigateByUrl('/');
    } else {
      console.log('Logout failed');
    }
  }
}
