import { defaultUsuario, Usuario } from "../../modules/app/usuario/utils/usuario.interface";
import { DataLocalStorage } from "../interfaces/data.local.storage";
import { decodeJWTUsuario } from "./jwt.utils";

const userLoggedItem = 'userLogged';
const boxRecordar = 'boxRecordar';
const emailLogin = 'emailLogin';
const passLogin = 'passLogin';

//const encryptionService: EncryptionService = new EncryptionService

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' && typeof localStorage !== 'undefined';
}

export function existUserLogged(): boolean {
  if (isBrowser()) {
    const data = JSON.parse(localStorage.getItem(userLoggedItem) || 'null');
    return data !== null;
  }
  return false;
}

/********************************************** DataLogged **********************************************/
export function getLocalDataLogged(): DataLocalStorage | null {
  if (isBrowser()) {
    const data = JSON.parse(localStorage.getItem(userLoggedItem) || 'null') as DataLocalStorage;
    return data !== null ? data : null;
  }
  return null;
}

export function setLocalDataLogged(data: DataLocalStorage): void {
  if (isBrowser()) {
    localStorage.setItem(userLoggedItem, JSON.stringify(data));
  }
}

export function deleteLocalStorageData(): void {
  if (isBrowser()) {
    localStorage.removeItem(userLoggedItem);
    localStorage.clear();
  }
}

export function sessionStorageLogOut(): boolean {
  deleteLocalStorageData();
  return !existUserLogged();
}

export function getLocalUsuario(): Usuario {
  if (isBrowser()) {
    const localData = getLocalDataLogged()
    if (localData) {
      return decodeJWTUsuario(localData.tokken) as Usuario;
    } else {
      return defaultUsuario();
    }
  }
  return defaultUsuario();
}

/********************************************** Box Recordar **********************************************/
export function getBoxRecordar(): boolean {
  if (isBrowser()) {
    const data = Boolean(localStorage.getItem(boxRecordar));
    return data;
  }
  return false;
}

export function setBoxRecordar(data: boolean): void {
  if (isBrowser()) {
    localStorage.setItem(boxRecordar, String(data));
  }
}

/********************************************** Email Login **********************************************/
export function getEmailLogin(): string | null {
  if (isBrowser()) {
    const data = String(localStorage.getItem(emailLogin));
    return data;
  } else {
    return null;
  }
}

export function setEmailLogin(data: string): void {
  if (isBrowser()) {
    localStorage.setItem(emailLogin, String(data));
  }
}

/********************************************** Password Login **********************************************/
export function getPassLogin(): string | null {
  if (isBrowser()) {
    const data = String(localStorage.getItem(passLogin));
    return data;
  } else {
    return null;
  }
}

export function setPassLogin(data: string): void {
  localStorage.setItem(passLogin, String(data));
}