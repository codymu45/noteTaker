// Dependencies
// =============================================================
var express = require('express');
var path = require('path');
var fs = require('fs');
const Note = require('./models/Note');
var cors = require('cors');

// Sets up the Express App
// =============================================================
var app = express(); 
app.use(cors());
var PORT = process.env.PORT || 3000;

//Creating Notes
var notes;
try {
    notes = JSON.parse(fs.readFileSync('db.json'));
} catch (err) {
    notes = [];
}

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root URL
app.get('/',(req, res) => {
    res.send('Welcome to our note taker');
});

// Get all notes
app.get('/api/notes', (req, res) => {
    if (notes.length === 0){
        return res.json({message: 'There are no notes!'})
    } else {
        return res.json(notes);
    }
});

$( document ).ready(function() {
    loadNotes();
});

function loadNotes(){
    var queryURL = `http://localhost:3000/api/notes`; 
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
    var queryURL = `http://localhost:3000/api/note?id=${id}`; 
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        $('.title').text(`${response.title}`);
        $('.body').text(`${response.note}`);
    });
}

function deleteNote(id) {
    var queryURL = `http://localhost:3000/api/note?id=${id}`; 
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
    var queryURL = `http://localhost:3000/api/notes/new`; 
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






