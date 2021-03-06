$( document ).ready(function() {
    loadNotes();
});

function loadNotes(){
    var queryURL = `https://mullennotetaker.herokuapp.com/api/notes`; 
    $.ajax({
        url: queryURL,
        method: 'GET',
        dataType: 'json'
    }).then(function(response){
        $('.sidePanel').empty();
        $('.sidePanel').append(`
            <button class="createNew" onclick="createNote()">Create New +</button>`)
        for(var i = 0; i < response.length; i++){
            $('.sidePanel').append(`
            <div class="sideBox">
            <p class="sideNote" onclick="loadNote(${response[i].id})">${response[i].title}</p>
            <p class="deleteNote" onclick="deleteNote(${response[i].id})">X</p>
            </div>`);
        }
    });
}

function loadNote(id) {
    var queryURL = `https://mullennotetaker.herokuapp.com/api/note?id=${id}`; 
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        $('.title').text(`${response.title}`);
        $('.body').text(`${response.note}`);
    });
}

function deleteNote(id) {
    var queryURL = `https://mullennotetaker.herokuapp.com/api/note?id=${id}`; 
    $.ajax({
        url: queryURL,
        method: 'DELETE'
    }).then(function(response){
        $('.viewPanel').empty();
        $('.viewPanel').append(`
            <div class="title"></div>
            <div class="body"></div>`);
        loadNotes();
    });
}


function createNote() {
    $('.viewPanel').empty();
    $('.viewPanel').append(`
    <div class="newNote">
    <h3>Title</h3>
    <input id="titleInput" placeholder="Enter Title Here">
    <br>
    <h3>Note</h3>
    <input id="noteInput" placeholder="Enter Note Here"> <br>
    <button type="submit" id="saveBtn" onclick="saveNote()">Save</button>
    </div>`)
}

function saveNote() {
    var titleInput = $('#titleInput').val();
    var noteInput = $('#noteInput').val();
    var data = {
        title: titleInput,
        note: noteInput
    }
    var queryURL = `https://mullennotetaker.herokuapp.com/api/notes/new`; 
    $.ajax({
        url: queryURL,
        method: 'POST',
        data: data,
        dataType: 'json'
    }).then(function(response){
        $('.viewPanel').empty();
        $('.viewPanel').append(`
            <div class="title"></div>
            <div class="body"></div>`);
        loadNotes();
    });

}






