const electron = require('electron');
const {ipcRenderer} = electron;
const table = document.querySelector('table');

ipcRenderer.on('item:add', function(e, item){
  table.className = 'collection';
  const tr = document.createElement('tr');
  tr.className = 'collection-item';
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  const td3 = document.createElement('td');
  const itemText = document.createTextNode(item);

  td1.appendChild(itemText);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  table.appendChild(tr);
});

ipcRenderer.on('item:clear', function(){
  table.className = '';
  table.innerHTML = '';
});

table.addEventListener('dblclick', removeItem);
stuff();

function removeItem(e){
  event.target.remove();
  if(table.children.length == 0){
    table.className = '';
  }
}

function stuff() {
  for (var i=0; i<3; i++) {
			var row = document.querySelector("table").insertRow(-1);
			for (var j=0; j<4; j++) {
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
