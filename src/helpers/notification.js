import Settings from './settings';

const TIMEOUT = 4000;

const NotificationManager = class {
  constructor() {
    this.queue = [];
    this.notification = null;
  }

  create(title, body) {
    if (!this.isQueueFull() && Settings.get('notifications.enabled')) {
      this.notification = new Notification(title, {
        body: body,
        silent: true
      });

      this.queue.push(this.notification);

      // Dismiss after timeout
      new Promise((resolve) => {
        setTimeout(() => {
          this.queue.pop();
          this.notification.close();
          this.notification = null;
        }, TIMEOUT);
      });
    }
  }

  isQueueFull() {
    return this.queue.length > 0;
  }
}

export default new NotificationManager();
