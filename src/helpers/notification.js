import Settings from './settings';

const TIMEOUT = 3000;

const NotificationManager = class {
  constructor() {
    this.queue = [];
    this.notification = null;
  }

  create(title, body, callback) {
    if (!this.isQueueFull() && Settings.get('notifications.enabled')) {
      this.notification = new Notification(title, {
        body: body,
        silent: true
      });

      if (callback) {
        this.notification.onclick = callback;
      }

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
