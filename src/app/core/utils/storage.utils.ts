import { DataLocalStorage, defaultDataLocalStorage } from "../interfaces/local/data-local-storage";
import { EncryptionService } from "../services/encryption.service";

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
    const data = JSON.parse(sessionStorage.getItem(userLoggedItem) || 'null');
    return data !== null;
  }
  return false;
}

/********************************************** DataLogged **********************************************/
export function getLocalDataLogged(): DataLocalStorage {
  if (isBrowser()) {
    const encryptionService = new EncryptionService();
    const encryptedData = sessionStorage.getItem(userLoggedItem);

    if (encryptedData) {
      try {
        // Descifrar y luego parsear el string JSON resultante
        const decryptedString = encryptionService.decrypt(encryptedData);
        return JSON.parse(decryptedString) as DataLocalStorage;
      } catch (error) {
        // Manejar errores de descifrado o JSON.parse
        console.error("Error al obtener o descifrar los datos de la sesión:", error);
        return defaultDataLocalStorage();
      }
    }
  }
  return defaultDataLocalStorage();
}

export function setLocalDataLogged(data: DataLocalStorage): void {
  if (isBrowser()) {
    const encryptionService = new EncryptionService();
    const dataString = JSON.stringify(data);
    const encryptedData = encryptionService.encrypt(dataString);

    sessionStorage.setItem(userLoggedItem, encryptedData);
  }
}

export function deleteLocalStorageData(): void {
  if (isBrowser()) {
    sessionStorage.removeItem(userLoggedItem);
    sessionStorage.clear();
  }
}

export function sessionStorageLogOut(): boolean {
  deleteLocalStorageData();
  return !existUserLogged();
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