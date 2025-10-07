import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { defaultUsuario, Usuario } from '../../core/interfaces/app/comprador/usuario.inteface';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseGenesisService } from '../../core/services/firebase.genesis.service';
import { environment } from '../../../environments/environment';
import { DataLocalStorage } from '../../core/interfaces/local/data-local-storage';
import { setLocalDataLogged } from '../../core/utils/storage.utils';
import { EncryptionService } from '../../core/services/encryption.service';
import { User } from '@angular/fire/auth';
import { Vendedor } from '../../core/interfaces/app/vendedor/vendedor.interface';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode = true;
  errorMessage: any = null;
  userType: 'comprador' | 'vendedor' = 'comprador';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firebaseGenesisService: FirebaseGenesisService,
    private router: Router,
    private encryptionService: EncryptionService,
    private headerService: HeaderService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: [''],
      whatsapp: ['']

    });
  }

  setUserType(type: 'comprador' | 'vendedor') {
    this.userType = type;
    this.isLoginMode = type === 'vendedor' ? true : this.isLoginMode;
    this.authForm.reset();
    this.errorMessage = null;
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('nombre')?.clearValidators();
    } else {
      this.authForm.get('nombre')?.setValidators([Validators.required]);
    }
    this.authForm.get('nombre')?.updateValueAndValidity();
    this.authForm.reset();
    this.errorMessage = null;
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.errorMessage = null;

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    if (this.isLoginMode) {
      const result = await this.authService.signInWithEmailAndPassword(email, password);
      console.log('login' ,result, this.userType)

      if (result.success && result.data) {
        const user = result.data;

        switch (this.userType) {
          case 'comprador':
            // Ya existe comprador (usuario)
            this.getUsuarioFirebase(user.uid);
            break;

          case 'vendedor':
            // Ya existe vendedor
            this.getVendedorFirebase(user.uid)
            break;
        }
      } else {
        this.errorMessage = result.message;
      }
    } else {
      const registerResult = await this.authService.createUserWithEmailAndPassword(email, password);
      if (registerResult.success && registerResult.data) {
        const user = registerResult.data;

        const newUser: Usuario = {
          ...defaultUsuario(),
          idUsuario: user.uid,
          email: email,
          password: this.encryptionService.encrypt(this.authForm.value.password),
          nombre: this.authForm.value.nombre,
          whatsapp: `591${this.authForm.value.whatsapp}`
        };

        this.crearUsuarioFirebase(newUser);
      } else {
        this.errorMessage = registerResult.message;
      }
    }
  }

  async signInWithGoogle() {
    const result = await this.authService.signInWithGoogle();
    if (result.success && result.data) {
      const user = result.data;

      const userExists = await this.firebaseGenesisService.existDoc(environment.collection.usuario, 'idUsuario', user.uid);
      if (!userExists) {
        // No existe Usuario
        const newUser: Usuario = {
          ...defaultUsuario(),
          idUsuario: user.uid,
          email: user.email || '',
          password: '',
          nombre: user.displayName || '',
          whatsapp: ''
        };

        this.crearUsuarioFirebase(newUser)
      } else {
        // Existe Usuario
        this.getUsuarioFirebase(user.uid)
      }
    } else {
      this.errorMessage = result.message;
    }
  }

  /*____________________________________ Usuario ____________________________________  */
  async crearUsuarioFirebase(_usuario: Usuario) {
    const create = await this.firebaseGenesisService.createDocWithID(environment.collection.usuario, _usuario.idUsuario, _usuario);
    console.log('resultCreate',create)
    if (create.success) {
      this.getUsuarioFirebase(_usuario.idUsuario);
    } else {
      this.errorMessage = create.message;
    }
  }

  async getUsuarioFirebase(uid: string) {
    const result = await this.firebaseGenesisService.findDocByField(environment.collection.usuario, 'idUsuario', uid);
    console.log('resultGet',result)
    if (result.success && result.data) {
      const usuario = result.data as Usuario;
      console.log(usuario)
      this.agregarSesionUsuario(usuario);
    } else {
      this.errorMessage = result.message;
    }
  }

  async agregarSesionUsuario(usuario: Usuario) {
    let dataLocalStorage: DataLocalStorage = {
      type: this.userType,
      usuario,
      vendedor: null,
      loggedDate: new Date().toISOString()
    };

    setLocalDataLogged(dataLocalStorage)

    this.headerService.triggerAction('refreshUser');

    this.router.navigate(['/']);
  }

  /*___________________________________ Vendedor ____________________________________  */
  async crearVendedorFirebase(_vendedor: Vendedor) {
    const create = await this.firebaseGenesisService.createDocWithID(environment.collection.vendedor, _vendedor.idVendedor, _vendedor);
    if (create.success && create.data) {
      const vendedor = create.data as Vendedor;
      this.agregarSesionVendedor(vendedor);
    } else {
      this.errorMessage = create.message;
    }
  }

  async getVendedorFirebase(uid: string) {
    const result = await this.firebaseGenesisService.findDocByField(environment.collection.vendedor, 'idVendedor', uid);
    console.log('find',result)
    if (result.success && result.data) {
      const vendedor = result.data as Vendedor;
      this.agregarSesionVendedor(vendedor);
    } else {
      this.errorMessage = result.message;
    }
  }

  async agregarSesionVendedor(vendedor: Vendedor) {
    let dataLocalStorage: DataLocalStorage = {
      type: this.userType,
      usuario: null,
      vendedor,
      loggedDate: new Date().toISOString()
    };

    setLocalDataLogged(dataLocalStorage)

    this.headerService.triggerAction('refreshUser');
    
    this.router.navigate(['/tienda']);
  }
}
