import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { deleteLocalStorageData, getLocalDataLogged } from '../../core/utils/storage.utils';
import { HeaderService } from '../../core/services/header.service';
import { DataLocalStorage, defaultDataLocalStorage } from '../../core/interfaces/local/data-local-storage';
import { defaultUsuario, Usuario } from '../../core/interfaces/app/comprador/usuario.inteface';
import { Vendedor } from '../../core/interfaces/app/vendedor/vendedor.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  //isLoggedIn = false;
  private authSubscription!: Subscription;
  private headerSubscription!: Subscription;

  dataLocalStorage: DataLocalStorage = defaultDataLocalStorage();
  userLogeado!: Usuario | Vendedor | null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.setDataLocalStorage();

    this.authSubscription = this.authService.isLoggedIn().subscribe(status => {
      //this.isLoggedIn = status;
    });

    this.headerSubscription = this.headerService.headerAction$.subscribe(action => {
      if (action === 'refreshUser') {
        this.setDataLocalStorage();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.headerSubscription.unsubscribe();
    }
  }

  setDataLocalStorage() {
    this.dataLocalStorage = getLocalDataLogged();
    this.userLogeado = this.dataLocalStorage.usuario ? this.dataLocalStorage.usuario : this.dataLocalStorage.vendedor;
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
      this.dataLocalStorage = defaultDataLocalStorage();
      this.userLogeado = null;
      this.router.navigateByUrl('/');
    } else {
      console.log('Logout failed');
    }
  }
}
