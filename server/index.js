require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {PORT} = process.env

const { login, register }  = require('./controllers/auth')
const { getAllPosts, getCurrentUserPosts, addPost, editPost, deletePost } = require('./controllers/posts')
const { isAuthenticated } = require('./middleware/isAuthenticated')

const app = express()

app.use(express.json())
app.use(cors())

// AUTH
app.post('/register', register)
app.post('/login', login)

app.get('/posts', getAllPosts)

app.get('/userposts/:userId', getCurrentUserPosts)
app.post('/posts', isAuthenticated, addPost)
app.put('/posts/:id', isAuthenticated, editPost)
app.delete('/posts/:id', isAuthenticated, deletePost)

app.listen(PORT, () => console.log(`db sync successful & server is up on ${PORT}`))