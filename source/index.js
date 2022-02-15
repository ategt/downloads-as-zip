import axios from 'axios';
import JSZip from 'jszip';
import 'jszip-utils';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import yeast from 'yeast';

/**
*  Construct archive from responses data list.
*  @param {Object[]} responses - An array of axios
          responses, with decorated data.
*  @param {string} url - 
*/
const buildArchive = function (responses, archive) {
  const sources = responses.map(result => ({url:result.url, uuid:result.uuid}));

  archive.file(`source.txt`, location.href);
  archive.file(`sources.json`, JSON.stringify(sources));

  for ( let result of responses ) {
    archive.file(result.uuid, result.response.data);
  }

  return archive;
};

/**
*  Generate a downloadable from the archive object, then
*  save with saveAs function from FileSaver.js.
*  @param {JSZip} archive - The Archive to save.
*/
export const saveArchive = function (archive) {
  archive.generateAsync({type:"blob"}).then(function(content) {
    console.log("Begining download.");
    saveAs(content, yeast() + ".zip");
  });
};

/**
*  
*/
const download = function (urls, promiseCollection, responses) {
  for ( let url of urls ) {
    promiseCollection.push(
      axios.get(url, {responseType: 'blob'}).then(function (response) {
        responses.push({url, response, uuid: uuidv4()});
      }).catch(console.error)
    );
  }
};

export const saveUrls = function (urls) {
  const results = new Array();
  const proms = new Array();

  download(urls, proms, results);

  const zip = new JSZip();

  axios.all(proms).then(function(not_sure){
    console.log("Data download finished, building archive.");
    buildArchive(results, zip);

    console.log("Archive constructed.  Generating...");
    saveArchive(zip);
  });
};