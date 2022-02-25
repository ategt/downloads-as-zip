import axios from "axios";
import JSZip from "jszip";
import "jszip-utils";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import yeast from "yeast";

/** 
 *   Utility for saving several resources from a remote network location to a 
 *    single downloadable archive.
 *
 *   @module
 */

/**
 *  This function takes a list of URL's and converts
 *    it into a list of decorated axios responses.
 *    Promises are involved.
 *
 *  @param {string[]} urls - List of URLs to download.
 *  @returns {Promise<object[]>} - Decorated responses from URL requests.
 */
function download (urls) {
  return new Promise(function (resolve, reject) {
    const responses = new Array();
    const promiseCollection = new Array();

    for ( let url of urls ) {
      promiseCollection.push(
        axios.get(url, {responseType: "blob"}).then(function (response) {
          responses.push({url, response, uuid: uuidv4()});
        }).catch(console.error)
      );
    }

    axios.all(promiseCollection).then(function(not_sure){
      resolve(responses);
    });
  });
};

/**
 *  Construct archive from responses data list.
 *
 *  @param {object[]} responses - An array of axios responses, with decorated
 *    data.
 *  @returns {JSZip} - The created archive.
 */
const buildArchive = function (responses) {
  const archive = new JSZip();

  const sources = responses.map(result => ({url:result.url, uuid:result.uuid}));

  archive.file("source.txt", location.href);
  archive.file("sources.json", JSON.stringify(sources));

  for ( let result of responses ) {
    archive.file(result.uuid, result.response.data);
  }

  return archive;
};

/**
 *  Generate a downloadable from the archive object, then
 *  save with saveAs function from FileSaver.js.
 *
 *  @param {JSZip} archive - The Archive to save.
 *  @returns {void}
 */
export function saveArchive (archive) {
  archive.generateAsync({type:"blob"}).then(function(content) {
    console.log("Begining download.");
    saveAs(content, yeast() + ".zip");
  });
};

/**
 * Saves a list of URL strings into a zip archive and then passes that archive 
 *   to the browser for downloading.
 *
 * @param {string[]} urls - List of URL's to be saved into zip archive.
 * @returns {void}
 */
export function saveUrls (urls) {
  download(urls)
  .then(function (responses) {
    console.log("Data download finished, building archive.");
    const archive = buildArchive(responses);

    console.log("Archive constructed.  Generating...");
    saveArchive(archive);
  });
};