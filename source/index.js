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

const delay = ms => new Promise(res => setTimeout(res, ms));

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
  };
};

window.calculateProgress = function () {
  const allProgress = window.progresses.reduce((itm, acc) => ({loaded: itm.loaded + acc.loaded, total: itm.total + acc.total}), {loaded: 0, total: 0});
  
  return Object.assign({}, allProgress, {progress: allProgress.loaded / allProgress.total});
};

window.progressReport = function () {
  const precentCompleted = Math.floor( window.calculateProgress().progress * 100 );
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

const update = function () {
  return new Promise(function(resolve, reject) {
    delay(2000).then(() => {
      console.log("Waited 2s");
      
      const percentCompleted = window.calculateProgress();

      if ( percentCompleted.progress < 1 && percentCompleted.total > 1 ) {
        console.log('completed: ', Math.floor(percentCompleted.progress * 100));
        update();
      } else if ( percentCompleted.progress >= 1 && percentCompleted.total > 1 ) {
        console.log("Full Progress", percentCompleted.progress, percentCompleted.total);
      } else {
        console.log("Waiting to load...", percentCompleted.total);
      }

      resolve();
    });
  });
};

update();