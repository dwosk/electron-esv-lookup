import request from 'request';
import querystring from 'querystring';
import Settings from './settings';
import fs from 'fs';
import path from 'path';
import { remote } from 'electron';

const downloadsDir = remote.app.getPath('downloads');

export const getPassage = async (userInput) => {
  let passage = '';
  /** Support for comma separated verses */
  if (userInput.indexOf(',') > -1) {
    /** Split first verse which includes book from others */
    let splitArray = userInput.split(',');
    /** Find the book and chapter */
    let book;
    let chapter;
    let bookArray = splitArray[0].split(' ');
    chapter = bookArray[bookArray.length - 1].split(':')[0];
    if (bookArray.length === 2) {
      book = bookArray[0];
    } else {
      book = `${bookArray[0]} ${bookArray[1]}`
    }
    /** Find verses */
    let verses =  userInput.split(':')[1].split(',');
    for (const verse of verses ) {
      passage += await query(`${book} ${chapter}:${verse}`)
      /** Separator */
      passage += "<p><br></p>"
    }
  } else {
    passage = await query(userInput);
  }

  console.log(passage);
  return passage;

  if (!passage) {
    throw new Error('Could not get passage: ', userInput);
  }
 };

/** TODO: Refactor based on endpoint type */
const query = async (input) => {
  try {
    console.log('Getting passage:', input);
    const endpoint = Settings.get('api.endpoint') === 0 ? 'html' : 'search'
    let query = {
      'q': input
    };
    if (endpoint === 'html') {
      query = {
        ...query,
        'include-audio-link': Settings.get('api.includeAudio'),
        'include-short-copyright': false,
        'include-footnotes': Settings.get('api.includeFootnotes'),
        'include-verse-numbers': Settings.get('api.includeVerseNumbers'),
        'include-first-verse-numbers': Settings.get('api.includeVerseNumbers'),
        'include-passage-references': Settings.get('api.includeReferences'),
        'include-headings': Settings.get('api.includeHeadings')
      };
    }
    query = querystring.stringify(query);
    console.log('query: ', query)
    const options = {
      baseUrl: 'https://esv-lookup-gateway.now.sh',
      uri: `/api/passage/${endpoint}?` + query,
      method: 'GET',
      timeout: 8000
    };

    let response;
    if (endpoint === 'audio') {
      response = await getAudio(input, options);
    } else {
      response = await getHtmlOrSearch(options);
    }

    if (endpoint === 'search') {
      if (response.results.length === 0) {
        return;
      } else {
        return response.results;
      }
    }

    if (response.passages[0] === null) {
      return;
    }

    return response.passages[0];
  } catch (e) {
    new Error(e);
  }
}

const getAudio = (reference, options) => {
  return new Promise((resolve, reject) => {
    let downloadPath = path.join(downloadsDir, reference);
    let filepath = downloadPath.split(':').join('_');
    filepath = filepath.split(' ').join('');
    filepath = `${filepath}.mp3`;
    console.log(filepath);
    request(options)
      .on('error', (err) => {
        console.error(err);
        reject();
      })
      .on('end', () => {
        resolve();
      })
      .on('response', (response) => {
        console.log(response)
      })
      .pipe(fs.createWriteStream(filepath));
  });
}

const getHtmlOrSearch = (options) => {
  return new Promise((resolve, reject) => {
    let data = '';
    request(options)
      .on('error', (err) => {
        console.error(err);
        const { message } = err;
        // todo: show notification
        if (/getaddrinfo ENOTFOUND/i.test(message)) {
          console.log('Check your Internet connection.');
        } else if (/ETIMEDOUT/i.test(message)) {
          console.log('Request timed out.');
        }
        reject();
      })
      .on('data', (chunk) => {
        data += chunk;
      })
      .on('end', () => {
        resolve(JSON.parse(data))
      });
  });
}
