var newContent = '';
var user_id = 1;
var data_id = 1;
var startflag = 0;
var workFrame = document.getElementsByClassName('work-frame').item(0);
var listFrame = document.getElementsByClassName('list-frame').item(0);
var noteList = document.getElementsByClassName('note-list').item(0);
var addButton = document.getElementById('add-button');
var searchBar = document.getElementById('search');
var searchButton = document.getElementById('search-button');
getData("NOTELIST UPDATE", {user_id: this.user_id});
searchBar.value = null;
noteList.addEventListener('click', function(e){
    selectNote(e);
},  false);

addButton.addEventListener('click', function(){
    editNote({"task":"INSERT", "result":[{"note_name": "Name of the Note", "note_content": "Text of the Note", "note_date": "Создание новой записи"}]});
},  false);

searchButton.onclick = function(e) {
    if(searchBar.value != null) {
        searchBar.value = null;
        searchEvent();
    }
    else searchEvent();
}


searchBar.addEventListener('input', function(){
  searchEvent();
},false);

function getData(commandToSend, dataToSend) {
    var myInit = { method: "POST",
                    body:JSON.stringify({
                        task:commandToSend,
                        myjson: dataToSend
                    })
                  };
    fetch('simpo.php',myInit)
    .then(
    function(response) {
        if (response.status !== 200) {
            alert('Ошибка ответа от сервера. Код статуса: ' + response.status);
            return;
        }
        response.json().then(function(returnedData){
            switch(returnedData.task){
                case "NOTELIST UPDATE":
                    newContent = '';
                    for(i = 0; i < returnedData.result.length; i++){
                        newContent += '<div data-id=' + returnedData.result[i].note_id + '>';
                        newContent += '<img class="marker" src="img/icons8-new-moon-24.png">';
                        newContent += '<span class="lf-note-name">' + returnedData.result[i].note_name + "</span>";
                        newContent += '<span class="lf-note-date">' + returnedData.result[i].note_date + "</span>";
                        newContent += '<img class="edit-button" src="img/icons8-edit-file-50.png">';
                        newContent += '<img class="remove-button" src="img/icons8-delete-50.png">'
                        newContent += '</div>'
                    }
                    noteList.innerHTML = newContent;
                    if(this.startflag == 0) {
                        data_id = noteList.children[0].dataset.id;
                        getData("WF UPDATE", {note_id: this.data_id});
                        startflag = 1;
                    }
                    noteList.children[0].setAttribute('id','selected-note');
                    break;
            
                case "WF UPDATE":
                    var tempData = noteList.querySelectorAll('div[data-id="' + data_id + '"] span');
                    newContent = '';
                    newContent += '<div class="wf-title">';
                    newContent += '<h3 class="wf-name">' + tempData[0].innerHTML + '</h3>';
                    newContent += '<h3 class="wf-date">' + tempData[1].innerHTML + '</h3>';
                    newContent += '</div>';
                    newContent += '<div class="wf-text">' + returnedData.result[0].note_content + '</div>';
                    workFrame.innerHTML = newContent;
                    break;
                
                case "EDIT":
                    editNote(returnedData);
                    break;
                
                case "DELETE":
                    if(returnedData.result == "TRUE"){     
                        noteList.children[returnedData.prev_pos].remove();                   
                        if(!document.getElementById('selected-note')){
                            previousPosition = returnedData.prev_pos;
                            if (previousPosition >= (noteList.childNodes.length-1)) {
                                previousPosition = noteList.childNodes.length-1;
                                this.data_id = noteList.childNodes[previousPosition].dataset.id;                                
                            }
                            noteList.children[previousPosition].setAttribute('id','selected-note');
                            getData("WF UPDATE", {note_id: this.data_id});
                        }
                    }
                    else alert("Ошибка удаления записи")
                    break;
                        
                case "NOTE UPDATE":
                    if(returnedData.result == "TRUE"){//Обновляем имя записи по имени рабочей области - так быстрее
                        noteList.querySelector('div[data-id="' + data_id + '"] span').innerHTML = document.getElementsByClassName('wf-name')[0].value;
                        getData("WF UPDATE", {note_id: data_id});
                    }
                    else alert("Ошибка обновления записи")
                    break;
                
                case "INSERT":
                    if(returnedData.result[0] == "TRUE"){
                        var newNoteText = '';
                        var dataFromTextFields = document.getElementsByTagName('textarea');
                        newNoteText += '<img class="marker" src="img/icons8-new-moon-24.png">';
                        newNoteText += '<span class="lf-note-name">' + dataFromTextFields[0].value + "</span>";
                        newNoteText += '<span class="lf-note-date">' + returnedData.result[1] + "</span>";
                        newNoteText += '<img class="edit-button" src="img/icons8-edit-file-50.png">';
                        newNoteText += '<img class="remove-button" src="img/icons8-delete-50.png">'
                        var newNote = document.createElement('div');
                        newNote.setAttribute("data-id", returnedData.result[2]);
                        newNote.innerHTML = newNoteText;
                        noteList.appendChild(newNote);
                        getData("WF UPDATE", {note_id: data_id});
                    }
                    else alert("Ошибка добавления записи")
                    break;
                
                case "ERROR":
                    alert(returnedData.result);
                    break;
      }
      });
    })
    .catch(function(err) {
        alert('Ошибка в отправке запроса');
    });
}

function selectNote(e) {
    var target = e.target;
    while (target.className != 'note-list') {
    if (target.tagName == 'DIV') {
      Highlight(target);
      getData("WF UPDATE", {note_id: this.data_id});
      return;
    }
    if(target.tagName == 'IMG') {
        if(target.className == 'remove-button'){
            if (confirm('Удалить запись?')) {
               target = target.parentNode;
                var previousPositionInArray = Array.prototype.indexOf.call(target.parentNode.children, target);
                getData("DELETE", {note_id: target.dataset.id, prev_pos: previousPositionInArray});  
            }
            return;
        }
        else if(target.className == 'edit-button'){
            Highlight(target.parentNode);
            getData("EDIT", {note_id: this.data_id});
            return;
        }
    }
    target = target.parentNode;
  }
}

function searchEvent(){
  
  var newSelectedNote;
  var notesNames = noteList.querySelectorAll('span.lf-note-name');
  var arrayOfNames=[];
  for(var i = 0; i < notesNames.length; i++){
    arrayOfNames.push(notesNames[i].textContent);
  }
  for (var i = 0; i < arrayOfNames.length; i++) {
        noteList.childNodes[i].removeAttribute('id');
    }
  if (searchBar.value != null) {
        searchButton.setAttribute('class','search-started');
        for (var i = 0; i < arrayOfNames.length; i++) {
            if (arrayOfNames[i].substring(0, searchBar.value.length).toLowerCase() != searchBar.value.toLowerCase()) {
                noteList.childNodes.item(i).setAttribute('id', 'hidden-note');
            }
            else  {
                if(newSelectedNote==null) newSelectedNote = i;
            }
        }
        var currentElement = noteList.querySelector('div[data-id="' + data_id + '"]');
        var previousPositionInArray = Array.prototype.indexOf.call(noteList.children, currentElement);
        if (noteList.childNodes.item(previousPositionInArray).getAttribute('id') != 'selected-note') {
            if(newSelectedNote != undefined){
                this.data_id=noteList.children[newSelectedNote].dataset.id;
                noteList.childNodes[currentSelectedNote].setAttribute('id','selected-note');
                getData("WF UPDATE", {note_id: this.data_id});
            }
        }        
    }
    if(searchBar.value == ""){
        searchButton.setAttribute('class','search-not-started');
    }
}

function editNote(flowdata) {
    if(flowdata.task=="EDIT") {
        var tempData = noteList.querySelectorAll('div[data-id="' + data_id + '"] span');
        flowdata.result[0].note_name = tempData[0].textContent;
        flowdata.result[0].note_date =  tempData[1].textContent;
    }
    newContent = '';
    newContent += '<div class="wf-title">';
    newContent += '<textarea class="wf-name" maxlength="22">' + flowdata.result[0].note_name + '</textarea>';
    newContent += '<h3 class="wf-date">' + flowdata.result[0].note_date + '</h3>';
    newContent += '</div>';
    newContent += '<textarea class="wf-text">' + flowdata.result[0].note_content + '</textarea>';
    newContent += '<div class="edit-mode">';
    newContent += '<input type="button" id="close-button" value="Отменить изменение">';
    newContent += '<input type="button" id="save-button" value="Сохранить">';
    newContent += '</div>';
    workFrame.innerHTML = newContent;
    var saveButton = document.getElementById('save-button');
    var closeButtom = document.getElementById('close-button');
    listFrame.addEventListener('click', listFrameCancelChangesAlert, true);  
    saveButton.addEventListener('click', function(e) {
        saveButtonReaction(flowdata.task);
        listFrame.removeEventListener('click', listFrameCancelChangesAlert, true);
    }, false);
    closeButtom.addEventListener('click', function(e) {
        if (confirm('Отменить изменения?')) {
            getData("WF UPDATE", {note_id: data_id});
            listFrame.removeEventListener('click', listFrameCancelChangesAlert, true);
        }
    }, false);
}

function Highlight(target) {
    data_id = target.dataset.id;
    if(document.getElementById('selected-note')){
        document.getElementById('selected-note').removeAttribute('id','selected-note');      
    }  
    target.setAttribute('id', 'selected-note');
}

function listFrameCancelChangesAlert(){
         if (confirm('Отменить изменения?')){
            getData("WF UPDATE", {note_id: data_id});
            listFrame.removeEventListener('click', listFrameCancelChangesAlert, true);
        }
}

function saveButtonReaction(task) {
        var command;
        if(task == "INSERT") command = task;
        else command = "NOTE UPDATE";
        var newData = document.getElementsByTagName('textarea');
        getData(command, {  note_name: newData[0].value,
                            note_content: newData[1].value,
                            note_id: this.data_id,
                            user_id: this.user_id});
}