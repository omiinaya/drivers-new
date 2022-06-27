const electron = require('electron')
const ipc = electron.ipcRenderer

//on DOM load
document.addEventListener("DOMContentLoaded", function (event) {
  console.log('loaded.')
  ipc.send("MAIN_REQUEST")
  test2()
  test3()
});

ipc.on('LOG_REQUEST', (evt, data) => {
  console.log(data)
});

function getMSI() {
  //MSI returns a JSON object which includes download URLs. No further parsing needed.
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


function getASROCK() {
  //ASROCK API returns an HTML file with the download URLs imbedded. Will need to parse out links.
  return new Promise(function (resolve, reject) {
    let url = "https://www.asrock.com/mb/Intel/Z590%20OC%20Formula/Download.html";
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('get', url, true);
    xhr.setRequestHeader("Accept", "text/html, */*; q=0.01");
    xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.9");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.responseType = 'document';
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
  let x = await getMSI()
  let y = x.result.downloads
  console.log(y)
}

async function test3() {
  let doc = await getASROCK();
  let table = doc.querySelectorAll('table');
  let elements = table[0].children[1].children;
  let drivers = [];
  for (element of elements) {
    drivers.push(element.innerHTML);
    let data = element.querySelectorAll("td")
    let title = data[0].innerHTML //driver titles
    let link = data[data.length - 2].querySelectorAll("a")[0].getAttribute('href') //-2 for USA, -1 for china
    console.log(title)
    console.log(link)
  }
  //console.log(drivers);
}