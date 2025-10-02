// Contenido para el modal de confrimacion, alerta, etc
export interface ModalConfig {
  type?: 'alert' | 'warning' | 'info' | '';
  title?: string;
  content?: string;
  button?: string;
  value?: string | number;
}
