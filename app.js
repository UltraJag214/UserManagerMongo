const express = require('express')
const fs = require('fs')
const path = require('path')
const json = require('./users.json')
 
let app = express()

app.use(express.urlencoded({extended: false}))

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/createNewUser', async(req,res) => {
    let newUser
    newUser = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        age: req.body.age,
        id: Math.floor(Math.random() * 1000)
    }
    json.fullUserList.push(newUser)
    fs.writeFile('users.json', JSON.stringify(json), (err) => {
        if(err) throw err
        console.log('success');
    })
    res.redirect('/user')
})

app.get('/user', (req, res) => {
    res.render('user', {whatever: json.fullUserList})
})

app.get('/edit/:namedit', (req,res) => {
    let myArr = json.fullUserList.filter(u => {if(req.params.namedit == u.id) return u})
    console.log(myArr);
    res.render('edit', {myObj: myArr[0]})
})

app.post('/edit/:userID', (req,res) => {
    let i
    let myArr = json.fullUserList.filter((u,index)=> {if(req.params.userID == u.id) { i = index; return u }})
    let userToSave = myArr[0]
    userToSave.name = req.body.name
    userToSave.username = req.body.username
    userToSave.email = req.body.email
    userToSave.age = req.body.age
    json.fullUserList[i] = userToSave
    fs.writeFile('users.json', JSON.stringify(json), (err) => {
        if(err) throw err
        console.log('success');
    })
    res.redirect('/user')
})

app.get('/deleteUser/:userID', (req,res) => {
    json.fullUserList.filter((theThing,index) => {
        if(theThing.id == req.params.userID) {
            json.fullUserList.splice(index, 1)
    }})
    fs.writeFile('users.json', JSON.stringify(json), (err) => {
        if(err) throw err
        console.log('success');
    })
    res.redirect('/user')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})