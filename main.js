const electron = require('electron');
const path = require('path');
const url = require('url');

process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'Window.html'),
    protocol: 'file',
    slashes:true
  }));
  mainWindow.on('closed', function() {
    app.quit();
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);


});

function stuff() {
  for (var i=0; i<6; i++) {
			var row = document.querySelector("table").insertRow(-1);
			for (var j=0; j<6; j++) {
					var letter = String.fromCharCode("A".charCodeAt(0)+j-1);
					row.insertCell(-1).innerHTML = i&&j ? "<input id='"+ letter+i +"'/>" : i||letter;
			}
	}

	var DATA={}, INPUTS=[].slice.call(document.querySelectorAll("input"));
	INPUTS.forEach(function(elm) {
			elm.onfocus = function(e) {
					e.target.value = localStorage[e.target.id] || "";
			};
			elm.onblur = function(e) {
					localStorage[e.target.id] = e.target.value;
					computeAll();
			};
			var getter = function() {
					var value = localStorage[elm.id] || "";
					if (value.charAt(0) == "=") {
							with (DATA) return eval(value.substring(1));
					} else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
			};
			Object.defineProperty(DATA, elm.id, {get:getter});
			Object.defineProperty(DATA, elm.id.toLowerCase(), {get:getter});
	});
	(window.computeAll = function() {
			INPUTS.forEach(function(elm) { try { elm.value = DATA[elm.id]; } catch(e) {} });
	})();
}

function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Tax Return Item'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  addWindow.on('close', function(){
    addWindow = null;
  });
}

ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add',item);
  addWindow.close();
  stuff();
});


// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label:'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}

