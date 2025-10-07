import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { defaultResultFirebase, ResultFirebase } from '../interfaces/api/result-firebase.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private loggedIn = new BehaviorSubject<boolean>(this.auth.currentUser !== null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.loggedIn.next(user !== null);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<ResultFirebase<User>> {
    let result = defaultResultFirebase<User>();
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      result.data = userCredential.user;
      result.success = true;
    } catch (error: any) {
      result.message = this.getAuthErrorMessage(error.code);
      result.error = error;
    }
    return result;
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<ResultFirebase<User>> {
    let result = defaultResultFirebase<User>();
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      result.data = userCredential.user;
      result.success = true;
    } catch (error: any) {
      result.message = this.getAuthErrorMessage(error.code);
      result.error = error;
    }
    return result;
  }

  async signInWithGoogle(): Promise<ResultFirebase<User>> {
    let result = defaultResultFirebase<User>();
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      result.data = userCredential.user;
      result.success = true;
    } catch (error: any) {
      result.message = this.getAuthErrorMessage(error.code);
      result.error = error;
    }
    return result;
  }

  async signOut(): Promise<ResultFirebase<void>> {
    let result = defaultResultFirebase<void>();
    try {
      await signOut(this.auth);
      result.success = true;
    } catch (error: any) { 
      result.message = this.getAuthErrorMessage(error.code);
      result.error = error;
    }
    return result;
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'El usuario no existe.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.';
      default:
        return 'Ha ocurrido un error inesperado.';
    }
  }
}
