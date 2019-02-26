
getData();

var newContent = '';
var editingFlag = 0;
var currentSelectedNote = 0;
var dataArray = [];
var workFrame = document.getElementsByClassName('work-frame').item(0);
var listFrame = document.getElementsByClassName('list-frame').item(0);
var noteList = document.getElementsByClassName('note-list').item(0);
var editButton = document.getElementsByClassName('edit-button');
var addButton = document.getElementById('add-button');
var searchBar = document.getElementById('search');
var searchButton = document.getElementById('search-button');
searchBar.value = null;

noteList.onclick = function(e) {
    selectNote(e);
};

addButton.onclick = function() {
            var date = new Date();
    dataArray.push({note_name: "Note" + (dataArray.length+1),
                    note_date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
                    note_content: "This is Note" + (dataArray.length+1) });
    noteListRefreser();
    noteList.childNodes.item(currentSelectedNote).setAttribute('id','selected-note');
    sendDataBack();
}
  
function getData(){
  var myInit = { method: 'POST'};
    fetch('simpo.php',myInit)
    .then(
    function(response) {
      if (response.status !== 200) {
        alert('Ошибка ответа от сервера. Код статуса: ' + response.status);
        return;
      }
      response.json().then(function(data){
        for(i = 0; i < data.length; i++) {
           dataArray.push({
                           note_id: data[i].user_id,
                           note_name: data[i].note_name,
                           note_date: data[i].note_date,
                           note_content: data[i].note_content,
                           user_id: data[i].user_id
                         });
        }
        noteListRefreser();
        noteList.childNodes.item(currentSelectedNote).setAttribute('id','selected-note');
        workFrameRefresher(currentSelectedNote);
      });
    })
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}
  
searchBar.onkeyup = function() {
    searchEvent();
};
searchButton.onclick = function(e) {
    if(searchBar.value != null) {
        searchBar.value = null;
        searchEvent();
    }
    else searchEvent();
}

function selectNote(e) {        //Переделать функцию распыления нажатого объекта
    var previousSelectedNote = currentSelectedNote;
    if(e.target.getAttribute('class') == 'note-list') return; 
    switch(e.target.tagName) {
        case 'DIV':  
            findNode(e.target);
            editingFlag = 0;
            break;
            
        case 'SPAN': 
            findNode(e.target.parentNode);
            editingFlag = 0;
            break;
            
        case 'IMG':
            findNode(e.target.parentNode);
            if(e.target.getAttribute('class') == 'edit-button') {
                editingFlag = 1;
            }
            else if(e.target.getAttribute('class') == 'remove-button') {
                dataArray.splice(currentSelectedNote, 1);
                noteListRefreser(); 
                currentSelectedNote = previousSelectedNote;                
            }
            break;
    }
    
    if (document.getElementById('selected-note')){
        document.getElementById('selected-note').removeAttribute('id');}
    
    if (currentSelectedNote >= (noteList.childNodes.length)) currentSelectedNote = noteList.childNodes.length-1;
    noteList.childNodes.item(currentSelectedNote).setAttribute('id','selected-note');
    
    if (editingFlag == 1) {
        editWorkFrameRefresher(currentSelectedNote);
    }
    else workFrameRefresher(currentSelectedNote);
}
function findNode(childNode) {
    for(i = 0; i < noteList.childNodes.length; i++){
        if (childNode == noteList.childNodes.item(i)) 
        {
            currentSelectedNote = i;
            return noteList.childNodes.item(i);
        }
    }
}
function noteListRefreser(){    
    var newContent = '';
    for(i = 0; i < dataArray.length; i++){
        newContent += '<div class="note' + i + '">';
        newContent += '<img class="marker" src="img/radio_btn_unselected.png">';
        newContent += '<span class="lf-note-name">' + dataArray[i].note_name + "</span>";
        newContent += '<span class="lf-note-date">' + dataArray[i].note_date + "</span>";
        newContent += '<img class="edit-button" src="img/ImgEdit.png">';
        newContent += '<img class="remove-button" src="img/delete_up.png">'
        newContent += '</div>'
    }
    noteList.innerHTML = newContent; 
}
function workFrameRefresher(selectedNote) {
    newContent = '';
    newContent += '<div class="wf-title">';
    newContent += '<h3 class="wf-name">' + dataArray[selectedNote].note_name + '</h3>';
    newContent += '<h3 class="wf-date">' + dataArray[selectedNote].note_date + '</h3>';
    newContent += '</div>';
    newContent += '<div class="wf-text">' + dataArray[selectedNote].note_content + '</div>';
    workFrame.innerHTML = newContent; 
    editingFlag = 0;
}
function editWorkFrameRefresher(selectedNote) {
    newContent = '';
    newContent += '<div class="wf-title">';
    newContent += '<textarea class="wf-name" maxlength="22">' + dataArray[selectedNote].note_name + '</textarea>';
    newContent += '<h3 class="wf-date">' + dataArray[selectedNote].note_date + '</h3>';
    newContent += '</div>';
    newContent += '<textarea class="wf-text">' + dataArray[selectedNote].note_content + '</textarea>';
    newContent += '<div class="edit-mode">';
    newContent += '<input type="button" id="close-button" value="Отменить изменение">';
    newContent += '<input type="button" id="save-button" value="Сохранить">';
    newContent += '</div>';
    workFrame.innerHTML = newContent;  
    editingFlag = 1;    
    var saveButton = document.getElementById('save-button');
    var closeButtom = document.getElementById('close-button');
    
    listFrame.addEventListener('click', listFrameCancelChangesAlert, true);  
    saveButton.addEventListener('click', function(e) {
        saveButtonReaction(currentSelectedNote);
        listFrame.removeEventListener('click', listFrameCancelChangesAlert, true);
    }, false);
    closeButtom.addEventListener('click', function(e) {
        if (confirm('Отменить изменения?')) {
            workFrameRefresher(currentSelectedNote);
            listFrame.removeEventListener('click', listFrameCancelChangesAlert, true);
        }
    }, false);
}
function searchEvent() { //Срабатывает при начале ввода в поиск
    var newSelectedNote;
    for (i = 0; i < dataArray.length; i++) {
        noteList.childNodes.item(i).removeAttribute('id');
    }
    if (searchBar.value != null) {
        var searchBarLenght = searchBar.value.length;
        searchButton.setAttribute('class','search-started');
        for (i = 0; i < dataArray.length; i++) {
            if (dataArray[i].note_name.substring(0, searchBarLenght).toLowerCase() != searchBar.value.toLowerCase()) {
                noteList.childNodes.item(i).setAttribute('id', 'hidden-note');
            }
            else  {
                if(newSelectedNote==null) newSelectedNote = i;
            }
        }
        if (noteList.childNodes.item(currentSelectedNote).getAttribute('id') != 'selected-note') {
            if(newSelectedNote != undefined){
                currentSelectedNote = newSelectedNote;
                noteList.childNodes.item(currentSelectedNote).setAttribute('id','selected-note');
                workFrameRefresher(currentSelectedNote);
            }
        }        
    }
    if(searchBar.value == ""){
        searchButton.setAttribute('class','search-not-started');}
}
function sendDataBack() {
  var myInit = { 
                method: 'POST',
                body: {myjs: JSON.stringify(dataArray)}
               };
    fetch('simpo.php',myInit)
    .then(
    function(response) {
      if (response.status !== 200) {
        alert('Ошибка ответа от сервера. Код статуса: ' + response.status);
        return;
      }
      response.text().then(function(text){
        alert(text);
      })
    });
}

function listFrameCancelChangesAlert(){
         if (confirm('Отменить изменения?')){
            workFrameRefresher(currentSelectedNote);
            listFrame.removeEventListener('click', listFrameCancelChangesAlert, true);
        }
    }
function saveButtonReaction(selectedNote) {
        var newData = document.getElementsByTagName('textarea');
        dataArray[selectedNote].note_name = newData.item(0).value;
        dataArray[selectedNote].note_content = newData.item(1).value;
        noteListRefreser();
        workFrameRefresher(selectedNote);
        noteList.childNodes.item(selectedNote).setAttribute('id','selected-note');
        sendDataBack();
    }