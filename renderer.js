const electron = require('electron')
const ipc = electron.ipcRenderer

//on DOM load
document.addEventListener("DOMContentLoaded", function (event) {
  console.log('loaded.')
  ipc.send("MAIN_REQUEST")
  test2()
});

ipc.on('LOG_REQUEST', (evt, data) => {
  console.log(data)
});

function test() {
  return new Promise(function (resolve, reject) {
    let url = "https://us.msi.com/api/v1/product/support/panel?product=MEG-Z590-GODLIKE&type=driver";
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('get', url, true);
    xhr.setRequestHeader("authority", "us.msi.com");
    xhr.setRequestHeader("accept", "*/*");
    xhr.setRequestHeader("accept-language", "en-US,en;q=0.9");
    xhr.responseType = 'json';
    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

async function test2() {
  let x = await test()
  console.log(x)
}