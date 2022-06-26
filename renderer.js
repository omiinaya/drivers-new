const electron = require('electron')
//const ipc = electron.ipcRenderer

//on DOM load
document.addEventListener("DOMContentLoaded", function (event) {
  console.log('loaded.')
});

const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(JSON.parse(this.response));
  }
});

xhr.open("GET", "https://us.msi.com/api/v1/product/support/panel?product=MEG-Z590-GODLIKE&type=driver");
xhr.setRequestHeader("authority", "us.msi.com");
xhr.setRequestHeader("accept", "*/*");
xhr.setRequestHeader("accept-language", "en-US,en;q=0.9");

xhr.send(data);