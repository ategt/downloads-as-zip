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
window.progresses = new Array();

const saveArchive = function (archive) {
  archive.generateAsync({type:"blob"}).then(function(content) {
    console.log("Begining download.");
    // see FileSaver.js
    saveAs(content, yeast() + ".zip");
  });
};

const downloadProgressUpdate = function (progressItem) {
  return function (progressEvent) {
    Object.assign(progressItem, {loaded: progressEvent.loaded, total: progressEvent.total});
    // const total = parseFloat(progressEvent.currentTarget.responseHeaders['Content-Length']);
    // const current = progressEvent.currentTarget.response.length;

    // let percentCompleted = Math.floor(current / total * 100);
    // console.log('completed: ', percentCompleted)
  };
};

window.progressReport = function () {
  const allProgress = window.progresses.reduce((itm, acc) => ({loaded: itm.loaded + acc.loaded, total: itm.total + acc.total}), {loaded: 0, total: 0});
  
  let percentCompleted = Math.floor(allProgress.loaded / allProgress.total * 100);
  console.log('completed: ', percentCompleted);
};

for ( let item of imgs ) {
  const line = item.src.replace("-200x250","");
  const progressItem = new Object();
  window.progresses.push(progressItem);

  proms.push(axios.get(line, {responseType: 'blob', onDownloadProgress: downloadProgressUpdate(progressItem)}).then(function (response) {
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
