
import { Direccion } from "../interfaces/app/comprador/usuario.inteface";

const selectedAddressItem = 'selectedAddress';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

/**
 * Guarda la dirección seleccionada en el sessionStorage.
 * @param address - El objeto de dirección a guardar.
 */
export function setSelectedAddress(address: Direccion): void {
  if (isBrowser()) {
    sessionStorage.setItem(selectedAddressItem, JSON.stringify(address));
  }
}

/**
 * Obtiene la dirección seleccionada desde el sessionStorage.
 * @returns El objeto de dirección o null si no se encuentra o hay un error.
 */
export function getSelectedAddress(): Direccion | null {
  if (isBrowser()) {
    const addressData = sessionStorage.getItem(selectedAddressItem);
    if (addressData) {
      try {
        return JSON.parse(addressData) as Direccion;
      } catch (error) {
        console.error("Error al obtener la dirección de la sesión:", error);
        return null;
      }
    }
  }
  return null;
}

/**
 * Elimina la dirección seleccionada del sessionStorage.
 */
export function clearSelectedAddress(): void {
    if (isBrowser()) {
        sessionStorage.removeItem(selectedAddressItem);
    }
}
