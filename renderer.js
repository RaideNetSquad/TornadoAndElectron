const { ipcRenderer } = require("electron");

ipcRenderer.on('message', (event, arg) => {
    const setData = (label, value) => {
        console.log(label)
        document.getElementById(label).value = value;
    }
    setData("name", arg["name"]);
    setData("work", arg["work"]);
})