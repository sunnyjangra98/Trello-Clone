const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

//Filter Arrays to remove empty items
function filterArray(array){
  const filteredArray = array.filter(item => item!==null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemElement(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  //Making List attribute draggable
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index},${column})`);
  //Append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad){
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemElement(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemElement(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemElement(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemElement(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();

}

//Update Item - Delete - Update Array Value
function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  
  if (!dragging) {
    if (!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    }
    else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

//Add to column list
function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

//Show add item input box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

//Hide Item Input Box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';

  addToColumn(column);
}

//Allows arrays and reflect Drag and Drop Items
function rebuildArrays(){
  // backlogListArray = [];
  // for (let index = 0; index < backlogList.children.length; index++) {
  //   backlogListArray.push(backlogList.children[index].textContent);
  // }
  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
  // progressListArray = [];
  // for (let index = 0; index < progressList.children.length; index++) {
  //   progressListArray.push(progressList.children[index].textContent);
  // }
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  // completeListArray = [];
  // for (let index = 0; index < completeList.children.length; index++) {
  //   completeListArray.push(completeList.children[index].textContent);
  // }
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  // onHoldListArray = [];
  // for (let index = 0; index < onHoldList.children.length; index++) {
  //   onHoldListArray.push(onHoldList.children[index].textContent);
  // }
  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);
  updateDOM();
}

//When Items start dragging
function drag(e){
  draggedItem = e.target;
  dragging = true;
  // console.log(draggedItem);
}

//When a Item Enters Column Area
function dragEnter(column){
  listColumns[column].classList.add('over');
  currentColumn = column;
}

//Columns Allows for Item to Drop
function allowDrop(e){
  e.preventDefault();

}

//Dropping Item in Column
function drop(e){
  e.preventDefault();
  //Remover Background Color/Padding
  listColumns.forEach(column => {
    column.classList.remove('over');
  });
  //Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  //Draggin Complete
  dragging = false;
  rebuildArrays();
}

//On Load
updateDOM();
