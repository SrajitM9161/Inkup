// File: /utils/downloadImageToLocal.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const downloadImageToLocal = async (url, localFilename) => {
  const localPath = path.join('/workspace/clipspace', localFilename);
  const writer = fs.createWriteStream(localPath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(localPath));
    writer.on('error', reject);
  });
};

export default downloadImageToLocal;
