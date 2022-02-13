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

for ( let item of imgs ) {
  const line = item.src.replace("-200x250","");
  proms.push(axios.get(line, {responseType: 'blob'}).then(function (response) {
    results.push({line, response});
  })
  .catch(function (error) {
    console.log(error);
  }));
}

const zip = new JSZip();
axios.all(proms).then(function(not_sure){
  for ( let result of results ) {
    const file_name = yeast();
    zip.file(`${file_name}.txt`, result.line);
    zip.file(file_name, result.response.data);
  }

  zip.generateAsync({type:"blob"}).then(function(content) {
      // see FileSaver.js
      saveAs(content, yeast() + ".zip");
  });
});
