import test from 'tape';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';

test("Save URL's (saveUrls) with a list of known urls", function (t) {
  const mockSaveArchive = sinon.stub(saveArchive);

	saveUrls(['http://127.0.0.1:5000/gasket-1.webp', 
			  'http://127.0.0.1:5000/gasket-2.webp',
			  'http://127.0.0.1:5000/gasket-3.webp',
			  'http://127.0.0.1:5000/gasket-4.webp']);

	console.log(mockSaveArchive);
});