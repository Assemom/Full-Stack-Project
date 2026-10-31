import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

export interface AppNotification {
  title: string;
  message: string;
  link?: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private toast = inject(ToastService);
  private router = inject(Router);
  private hubConnection: signalR.HubConnection | null = null;

  notifications = signal<AppNotification[]>([]);
  unreadCount = signal(0);
  connected = signal(false);

  start(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: AppNotification) => {
      this.notifications.update((n) => [notification, ...n].slice(0, 50));
      this.unreadCount.update((c) => c + 1);
      this.toast.info(`${notification.title}: ${notification.message}`);
    });

    this.hubConnection.start()
      .then(() => this.connected.set(true))
      .catch(() => {});
  }

  stop(): void {
    this.hubConnection?.stop();
    this.connected.set(false);
  }

  markAllRead(): void {
    this.unreadCount.set(0);
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
