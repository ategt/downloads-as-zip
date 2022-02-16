import test from 'tape';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';

test("Save URL's (saveUrls) with a list of known urls", function (t) {
  const mockSaveArchive = sinon.stub(saveArchive);

	saveUrls(['http://127.0.0.1:5000/gasket-1.webp', 
			  'http://127.0.0.1:5000/gasket-2.webp',
			  'http://127.0.0.1:5000/gasket-3.webp',
			  'http://127.0.0.1:5000/gasket-4.webp']);

	//console.log(mockSaveArchive);
  console.log("Words here");
  t.equal(1,1);
  t.equal(1,2);
});

test('timing test', function (t) {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    var start = Date.now();

    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});

test('test using promises', async function (t) {
    const result = await someAsyncThing();
    t.ok(result);
});