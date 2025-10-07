import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomNotification } from '../../core/interfaces/ui/notification.interface';
import { NotificationService } from '../../core/services/ui/notification.service';

@Component({
    selector: 'app-custom-notification',
    imports: [CommonModule],
    templateUrl: './custom-notification.component.html',
    styleUrls: ['./custom-notification.component.css']
  })
  export class CustomNotificationComponent implements OnInit {
    /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  
    notifications: CustomNotification[] = [];
    /** ----------------------------------------- Constructor ----------------------------------------- **/
    constructor(private notificationService: NotificationService) {
      this.notificationService.notification$.subscribe((notification) => {
        this.notifications.push(notification);
  
        setTimeout(() => this.removeNotification(notification), 5000);
      });
    }
  
    /** ------------------------------------------- OnInit -------------------------------------------- **/
    ngOnInit() { }
  
    /** ------------------------------------------ OnDestroy ------------------------------------------ **/
  
    /** ------------------------------------------- Methods ------------------------------------------- **/
    removeNotification(notification: CustomNotification) {
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }
  
    getNotificationType(type: string): string {
      switch (type) {
        case 'success':
          return 'bg-green-400 text-light';
        case 'error':
          return 'bg-red-400 text-light';
        case 'warning':
          return 'bg-yellow-400 text-light';
        case 'info':
          return 'bg-blue-400 text-light';
        default:
          return 'bg-light text-dark';
      }
    }
  
    getNotificationIcon(type: string): string {
      switch (type) {
        case 'success': return 'fa-regular fa-circle-check fa-xl';
        case 'error': return 'fa-regular fa-circle-xmark fa-xl';
        case 'warning': return 'fa-solid fa-triangle-exclamation fa-xl';
        case 'info': return 'fa-solid fa-circle-info fa-xl';
        default: return '';
      }
    }
  
    /** ---------------------------------------- Methods onClick -------------------------------------- **/
    onClickClose(index: number) {
      this.removeNotification(this.notifications[index]);
    }
  
  }