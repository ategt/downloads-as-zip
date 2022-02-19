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
 *  Construct archive from responses data list.
 *
 *  @param {object[]} responses - An array of axios responses, with decorated
 *    data.
 *  @param {string} archive - Source zip archive that responses
 *          are created in.
 *  @returns {JSZip} - The created archive.
 */
const buildArchive = function (responses, archive) {
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
 *  This function takes a list of URL's and fills
 *    the argumented list of responses.
 *
 *  We want this function to return a list of promises,
 *    that will resolve to a list of responses.
 *
 *  @param {string[]} urls - List of URLs to download.
 *  @param {Promise[]} promiseCollection - Outstanding promises
 *     to be monitored for completion.
 *  @param {object[]} responses - An output argument, this is the
 *     list of response/url/uuid objects that will be converted 
 *     into a zip archive.
 *  @returns {void}
 */
function download (urls, promiseCollection, responses) {
  for ( let url of urls ) {
    promiseCollection.push(
      axios.get(url, {responseType: "blob"}).then(function (response) {
        responses.push({url, response, uuid: uuidv4()});
      }).catch(console.error)
    );
  }
};

/**
 * Saves a list of URL strings into a zip archive and then passes that archive 
 *   to the browser for downloading.
 *
 * @param {string[]} urls - List of URL's to be saved into zip archive.
 * @returns {void}
 */
export function saveUrls (urls) {
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