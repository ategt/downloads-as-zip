/**
 *  Helper Utilites for loading test fixture data.
 *
 *  @module
 */

/**
 *  Converts a Base64 encoded string into a Binary Large Object.
 *
 *  Taken from
 *  https://stackoverflow.com/a/20151856
 *
 *  @param {string} base64Data - Source data for blob conversion
 *  @param {string} contentType - MIME type to use
 *  @returns {Blob} - Created from arguments
 */
export const base64toBlob = (base64Data, contentType) => {
    contentType = contentType || "";
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
};

/**
 *  Function to convert a base64 string to a blob.
 *
 *  Intended to be used in conjunction with 'url-loader' for loading simulated network
 *  data in tests.
 *
 *  Based on the choosen answer at
 *  stackoverflow.com/questions/57929718/loading-binary-file-with-webpack-and-converting-to-blob  
 *
 *  @param {string} rawDataString - The result of url-loader goes here
 *  @returns {Blob} - File contents as a blob.
 */
export const convertToBlob = rawDataString => {
  const [match, contentType, base64] = rawDataString.match(/^data:(.+);base64,(.*)$/);

  return base64toBlob(base64, contentType);
};
