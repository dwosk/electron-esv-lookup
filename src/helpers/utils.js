import https from 'https';
import querystring from 'querystring';
import Settings from './settings';

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
    console.log('Getting passage: ', input);
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
      host: 'esv-lookup-gateway.now.sh',
      path: `/api/passage/${endpoint}?` + query,
      method: 'GET'
    };

    let response = await request(options);

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

/**
 * Returns ESV API response
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      // TODO: Catch network error
      // getaddrinfo ENOTFOUND api.esv.org

      resp.on('end', () => {
        resolve(JSON.parse(data));
      }).on('error', reject);
    });

    // If no response after 8 seconds just resolve
    setTimeout(() => {
      resolve();
    }, 8000);

    req.end();
  });
}
