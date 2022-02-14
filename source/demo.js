import { saveUrls } from 'index';

const gallery = document.getElementById("gallery-2");
const imgs = gallery.getElementsByTagName("img");
saveUrls(imgs.map(img => img.src.replace("-200x250","")));