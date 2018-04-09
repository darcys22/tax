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

function removeItem(e){
  event.target.remove();
  if(table.children.length == 0){
    table.className = '';
  }
}
