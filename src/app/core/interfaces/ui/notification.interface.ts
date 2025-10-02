// para mostrar notificaciones flotantes
export interface CustomNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}