import axios from 'axios';
import 'jszip-utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import yeast from 'yeast';

const gal2 = document.getElementById("gallery-2");
const imgs = gal2.getElementsByTagName("img");

const results = new Array();
const proms = new Array();

window.results = results;
window.proms = proms;
window.axios = axios;

const delay = ms => new Promise(res => setTimeout(res, ms));

const saveArchive = function (archive) {
  archive.generateAsync({type:"blob"}).then(function(content) {
    console.log("Begining download.");
    // see FileSaver.js
    saveAs(content, yeast() + ".zip");
  });
};

for ( let item of imgs ) {
  const line = item.src.replace("-200x250","");
  const progressItem = new Object();
  window.progresses.push(progressItem);

  proms.push(axios.get(line, {responseType: 'blob'}).then(function (response) {
    results.push({line, response});
  })
  .catch(function (error) {
    console.log(error);
  }));
}

const zip = new JSZip();
window.zip = zip;

axios.all(proms).then(function(not_sure){
  console.log("Data download finished, building archive.");

  zip.file(`source.txt`, location.href);

  for ( let result of results ) {
    const file_name = yeast();
    zip.file(`${file_name}.txt`, result.line);
    zip.file(file_name, result.response.data);
  }

  console.log("Archive constructed.  Generating...");
  saveArchive(zip);
});