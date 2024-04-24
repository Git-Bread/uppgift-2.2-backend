let url = "http://127.0.0.1:3000";
let getData = "/data";

//some startup logic to get the whole thing started
function startup() {

    //adds functionality if page is right, with prevent of default submit behavior to stop reloading but keep required functionality
    let removeButton = document.getElementById("removeButton");
    if (removeButton != null) {
        removeButton?.addEventListener("click", () => remove());   
    }
    let addButton = document.getElementById("addButton");
    if (addButton != null) {
        addButton?.addEventListener("click", () => add());   
    }
    let updateButton = document.getElementById("updateButton");
    if (updateButton != null) {
        updateButton?.addEventListener("click", () => update());   
    }
    populate();
}

//simple create and push elements
async function populate() {
    let data = await ask(getData);
    let optionContainer = document.getElementById("opt");
    let headContainer = document.getElementById("tableSection")?.children[0].children[0];

    //removes content except the head of the table to stop repeats when repopulating after change
    while (headContainer?.children[1]) {
        headContainer?.removeChild(headContainer.lastChild as HTMLElement);
    }
    while (optionContainer?.children[0]) {
        optionContainer?.removeChild(optionContainer.lastChild as HTMLElement);
    }

    //populating with all information from database
    for (let index = 0; index < data.length; index++) {
        let container = document.createElement("tr");
        let idObject= document.createElement("td");
        let nameObject = document.createElement("td");
        let roleObject = document.createElement("td");
        let startObject = document.createElement("td");
        let endObject = document.createElement("td");
        let idListObject = document.createElement("option");
        idObject.innerHTML = data[index].id;
        idListObject.innerHTML = data[index].id;
        nameObject.innerHTML = data[index].companyname;
        roleObject.innerHTML = data[index].jobtitle;
        startObject.innerHTML = data[index].startdate as string;
        endObject.innerHTML = data[index].enddate as string;
        container.append(idObject);
        container.append(nameObject);
        container.append(roleObject);
        container.append(startObject);
        container.append(endObject);
        headContainer?.append(container);
        optionContainer?.append(idListObject);
    }
}

async function remove() {
    let obj = <HTMLInputElement>document.getElementById("opt");
    let res = await fetch(url + "/remove", {
        method: 'DELETE',
        body: JSON.stringify({"remove": parseFloat(obj?.value)}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    if (res.error) {
        errLog(res);
    }
    populate();
}

async function ask(add: string){
    let requestData = await fetch(url + add);
    let output = await requestData.json();
    return output;
}

async function update() {
    let form = document.getElementById("update") as HTMLFormElement;
    let obj = <HTMLInputElement>document.getElementById("opt");
    let newEntry = {
        id: obj?.value,
        companyname: form?.getElementsByTagName("input")[0].value,
        jobtitle: form?.getElementsByTagName("input")[1].value,
        startdate: form?.getElementsByTagName("input")[2].value,
        enddate: form?.getElementsByTagName("input")[3].value
    };
    let res = await fetch(url + "/update", {
        method: 'PUT',
        body: JSON.stringify(newEntry),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    if (res.error) {
        errLog(res);
    }
    form?.reset()
    populate();
}

async function add() {
    let form = document.getElementById("add") as HTMLFormElement;
    let newEntry = {
        id: form?.getElementsByTagName("input")[0].value,
        companyname: form?.getElementsByTagName("input")[1].value,
        jobtitle: form?.getElementsByTagName("input")[2].value,
        startdate: form?.getElementsByTagName("input")[3].value,
        enddate: form?.getElementsByTagName("input")[4].value
    };
    let res = await fetch(url + "/add", {
        method: 'POST',
        body: JSON.stringify(newEntry),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    if (res.error) {
        errLog(res);
    }
    form?.reset();
    populate();
}

//not sure what format to use here to be honest hence any
function errLog(objArr: any) {
    let container = document.getElementById("error");
    for (let index = 0; index < objArr.error.length; index++) {
        console.log(objArr.error[index]);
        let element = document.createElement("p");
        element.innerHTML = objArr.error[index];
        container?.append(element);     
    }
}


//making sure its all loaded before running, i miss c++
window.onload = function() {
    startup()
}