const express = require("express");

const app = express();

const PORT = 3001;

// get route
app.get('/api/notes', (req,res) => {
    res.json('api is good');
})
// middleware
app.use(express.static('public'))

// listen
app.listen(PORT, () => {
console.log(`app is listening on http://localhost:${PORT}`)
})