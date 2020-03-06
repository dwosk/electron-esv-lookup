import request from 'request';
import querystring from 'querystring';
import Settings from './settings';
import fs from 'fs';
import path from 'path';
import NotificationManager from './notification';
import { remote } from 'electron';

const downloadsDir = remote.app.getPath('downloads');

export const getPassage = async (userInput, options) => {
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
    passage = await query(userInput, options);
  }

  console.log(passage);
  return passage;

  if (!passage) {
    throw new Error('Could not get passage: ', userInput);
  }
 };

/** TODO: Refactor based on endpoint type */
const query = async (input, options) => {
  try {
    console.log('Getting passage:', input);
    let endpoint = Settings.get('api.endpoint') === 0 ? 'html' : 'search'
    if (options && options.mp3) {
      endpoint = 'audio';
    }

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
    const httpOptions = {
      baseUrl: 'https://esv-lookup-gateway.now.sh',
      uri: `/api/passage/${endpoint}?` + query,
      method: 'GET',
      timeout: 8000
    };

    let response;
    if (endpoint === 'audio') {
      response = await getAudio(input, httpOptions);
      return response;
    } else {
      response = await getHtmlOrSearch(httpOptions);
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
    let filename = reference.split(':').join('_');
    filename = filename.split(' ').join('');
    filename = filename + '.mp3';
    let absolutePath = path.join(downloadsDir, filename);
    console.log('Downloading to:', absolutePath);
    request(options)
      .on('error', (err) => {
        console.error(err);
        reject();
      })
      .on('end', () => {
        resolve({
          path: absolutePath
        });
      })
      .on('response', (response) => {
      })
      .pipe(fs.createWriteStream(absolutePath));
  });
}

const getHtmlOrSearch = (options) => {
  return new Promise((resolve, reject) => {
    let data = '';
    request(options)
      .on('error', (err) => {
        console.error(err);
        const { message } = err;
        if (/getaddrinfo ENOTFOUND/i.test(message)) {
          NotificationManager.create('Error!', 'Check your Internet connection.');
        } else if (/ETIMEDOUT/i.test(message)) {
          NotificationManager.create('Error!', 'Request timed out.');
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
