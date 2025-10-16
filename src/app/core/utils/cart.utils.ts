import { Carrito, defaultCarrito } from "../interfaces/app/comprador/usuario.inteface";
import { EncryptionService } from "../services/encryption.service";

const cartItem = 'userCart';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function existCart(): boolean {
  if (isBrowser()) {
    const data = localStorage.getItem(cartItem);
    return data !== null;
  }
  return false;
}

export function getCart(): Carrito {
  if (isBrowser()) {
    const encryptionService = new EncryptionService();
    const encryptedData = localStorage.getItem(cartItem);

    if (encryptedData) {
      return JSON.parse(encryptedData) as Carrito;
      /*try {
        const decryptedString = encryptionService.decrypt(encryptedData);
        return JSON.parse(decryptedString) as Carrito;
      } catch (error) {
        console.error("Error al obtener o descifrar los datos del carrito:", error);
        return defaultCarrito();
      }*/
    }
  }
  return defaultCarrito();
}

export function setCart(cart: Carrito): void {
  if (isBrowser()) {
    //const encryptionService = new EncryptionService();
    //const dataString = JSON.stringify(cart);
    //const encryptedData = encryptionService.encrypt(dataString);
    //localStorage.setItem(cartItem, encryptedData);
    localStorage.setItem(cartItem, JSON.stringify(cart));
  }
}

export function deleteCart(): void {
  if (isBrowser()) {
    localStorage.removeItem(cartItem);
  }
}
