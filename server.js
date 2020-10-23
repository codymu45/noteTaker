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
app.use( express.static(__dirname));

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname + "/index.html"))
 });

app.get('/index.html', (req, res) =>{
    res.sendFile('./index.html')
 });

app.get('/script.js', (req, res) =>{
    res.sendFile('./script.js')
 });

app.get('/style.css', (req, res) =>{
    res.sendFile('./style.css')
 });

// Get all notes
app.get('/api/notes', (req, res) => {
    if (notes.length === 0){
        return res.json({message: 'There are no notes!'})
    } else {
        return res.json(notes);
    }
});

// Get specific note
app.get('/api/note', (req, res) => {
    for (var i = 0; i < notes.length; i++){
        if(notes[i].id == req.query.id){
            return res.json(notes[i]);
        }
    }
    return res.json({message: 'Note doesnt exist!'})
  }); 


// Add note
app.post('/api/notes/new', (req, res) => {
    var id = 1;
    if(notes.length != 0){
        id = notes[notes.length - 1].id + 1;
    }
    const noteTitle = (req.body.title);
    const noteBody = (req.body.note);
    const note = new Note(id, noteTitle, noteBody);
    notes.push(note);
    saveDb();
    res.json(notes); 
});

// Delete note
app.delete('/api/note', (req, res) => {
    for (var i = 0; i < notes.length; i++){
        if(notes[i].id == req.query.id){
            notes.splice(i, 1);
            saveDb();
            return res.json({message: 'Message has been deleted!'});
        }
    }
    return res.json({message: 'Message cannot be deleted!'});
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});


// Save DB
function saveDb(){
    fs.writeFile('db.json', JSON.stringify(notes, null, 4), (err) => {
        if(err) throw err;
    });
}