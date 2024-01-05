const express = require('express')
const router = express.Router()
const Chat = require('../models/chatModel')

// define the home page route
router.get('/', async (req, res) => {
  const data = await Chat.find({})
  res.json(data)
})
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router