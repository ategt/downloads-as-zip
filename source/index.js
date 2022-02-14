import axios from 'axios';
import JSZip from 'jszip';
import 'jszip-utils';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import yeast from 'yeast';

const buildArchive = function (responses, archive) {
  const sources = responses.map(result => ({line:result.line, uuid:result.uuid}));

  zip.file(`source.txt`, location.href);
  zip.file(`sources.json`, JSON.stringify(sources));

  for ( let result of responses ) {
    zip.file(result.uuid, result.response.data);
  }
};

const saveArchive = function (archive) {
  archive.generateAsync({type:"blob"}).then(function(content) {
    console.log("Begining download.");
    // see FileSaver.js
    saveAs(content, yeast() + ".zip");
  });
};

const download = function (urls, promiseCollection, responses) {
  for ( let line of urls ) {
    promiseCollection.push(axios.get(line, {responseType: 'blob'}).then(function (response) {
      responses.push({line, response, uuid: uuidv4()});
    })
    .catch(console.error);
  }
};

const gallery = document.getElementById("gallery-2");
const imgs = gallery.getElementsByTagName("img");

const results = new Array();
const proms = new Array();

window.results = results;
window.proms = proms;
window.axios = axios;

download(imgs.map(img => img.src.replace("-200x250","")), proms, results);

const zip = new JSZip();
window.zip = zip;

axios.all(proms).then(function(not_sure){
  console.log("Data download finished, building archive.");
  buildArchive(results, zip);

  console.log("Archive constructed.  Generating...");
  saveArchive(zip);
});