import Store from 'electron-store';

const Settings = new Store({
  defaults: {
    api: {
      includeFootnotes: false,
      includeAudio: false,
      includeVerseNumbers: true,
      includeHeadings: true,
      includeReferences: true,
      endpoint: 0  // 0: HTML, 1: Search
    },
    notifications: {
      enabled: true
    }
  }
});

export default Settings;
