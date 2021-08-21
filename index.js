const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

// middlewares
app.use(express.json())

morgan.token('body', function getId (req) {
    return JSON.stringify(req.body)
  })
  app.use(morgan(':method :url :status :response-time :body '))

let hardCodedData = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// routes
app.get('/', (req,res) => {
    res.send('<h1>Hello worlds</h1>')
})

// show all db
app.get('/api/phonebooklist', (req,res) => {
    res.json(hardCodedData)
})

// get info about what is in db
app.get('/api/info', (req,res) => {
    const reqDate = new Date();
    const phonesListLength = hardCodedData.length;

    res.send(`
    <p>PhoneBook has info for ${phonesListLength} people</p>
    <p>Date when request was made is ${reqDate}</p>
    `)
})

// get single element from db
app.get('/api/:id', (req,res) => {
    const reqId = Number(req.params.id);
    const findUserById = hardCodedData.find((userContact) => userContact.id === reqId)
    if(findUserById) {
        res.json(findUserById)
    } else {
        res.status(400).end()
    }
})

// delete single element from db by id
app.delete('/api/:id', (req, res) => {
    const reqId = Number(req.params.id);

    const filteredData = hardCodedData.filter( (contact) => contact.id !== reqId)

    hardCodedData = filteredData;
    res.status(204).end();
})

// post single element to db
app.post('/api/phonebooklist', (req,res) => {
    const body = req.body;
    if(!body.name || !body.phone) {
        return res.status(400).json(
            "please add all information"
        )
    }
    const checkIfUserExist = hardCodedData.filter((user) => user.name === body.name)
    if(checkIfUserExist.length > 0) {
        console.log(checkIfUserExist === true)
        return res.status(400).json("user exist")
    }
    const id = Math.random() * 100;
    body.id = id;

    hardCodedData = hardCodedData.concat(body)
    res.json(body)
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})