import Store from 'electron-store';

const Settings = new Store({
  defaults: {
    api: {
      includeFootnotes: false,
      includeAudio: false,
      includeVerseNumbers: true,
      includeHeadings: true
    }
  }
});

export default Settings;
