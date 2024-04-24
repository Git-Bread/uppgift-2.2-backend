let url = "http://127.0.0.1:3000";
console.log(url);
let getData = "/data";
async function startup() {
    let rawData = await ask(getData);
    console.log(rawData);
}

function populate() {

}

async function ask(add: string){
    let requestData = await fetch(url + add);
    let output = await requestData.json();
    return output;
}

startup();