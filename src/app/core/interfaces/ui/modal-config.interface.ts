import { Type } from '@angular/core';

// Contenido para el modal de confrimacion, alerta, etc
export interface ModalConfig {
  // Para modales dinámicos con componentes
  component?: Type<any>;
  data?: any;

  // Para modales de alerta/confirmación simples
  type?: 'alert' | 'warning' | 'info' | '';
  title?: string;
  content?: string;
  button?: string;
  value?: string | number;
}
