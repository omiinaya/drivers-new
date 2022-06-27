const electron = require('electron')
const ipc = electron.ipcRenderer

//on DOM load
document.addEventListener("DOMContentLoaded", function (event) {
  console.log('loaded.')
  ipc.send("MAIN_REQUEST")
  urlsMSI()
  urlsASROCK()
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

async function urlsMSI() {
  const data = await getMSI()
  const categories = data.result.downloads
  let result = {};
  for (let category in categories) {
    if (category === "os" || category === "type_title") continue;
    let drivers = categories[category]
    for (let driver in drivers) {
      const title = drivers[driver].download_title
      const url = drivers[driver].download_url
      result[title] = url;
    }
  }
  console.log(result)
  return result
}

async function urlsASROCK() {
  const doc = await getASROCK();
  const table = doc.querySelectorAll('table');
  const elements = table[0].children[1].children;

  let result = {};
  for (element of elements) {
    const data = element.querySelectorAll("td")
    const title = data[0].innerText //driver titles
    const url = data[data.length - 2].querySelectorAll("a")[0].getAttribute('href') //-2 for USA, -1 for china
    result[title] = url;
  }
  console.log(result)
  return result;
}