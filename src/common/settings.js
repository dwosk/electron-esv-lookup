import Store from 'electron-store';

const Settings = new Store({
  defaults: {
    api: {
      includeFootnotes: false,
      includeAudio: false,
      includeVerseNumbers: true,
      includeHeadings: true
    },
    copy: {
      auto: true
    }
  }
});

export default Settings;
