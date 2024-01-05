const express = require('express')
const router = express.Router()
const Conversation = require('../models/conversationModel')

//getAll Conversation
router.get("/", async (req, res) => {
  const data = await Conversation.find({});
  res.json(data);
});


//post server
router.post("/", async (req, res) => {
  const data = new Conversation({
    server: req.body.server,
    pair: req.body.pair, //array
    chat: req.body.chat, //array
    status: req.body.status
  });

  try {
    await data.save();
    res.status(201).json({ message: "Server created successfully" });
  } catch (err) {
    console.error("Error creating server:", err);
    res.status(500).json({ error: "Failed to create server" });
  }
});



// Get server by ID
router.get("/:id", async (req, res) => {
  try {
    const server = await Conversation.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    res.json(server);
  } catch (err) {
    console.error("Error getting server by ID:", err);
    res.status(500).json({ error: "Failed to retrieve server" });
  }
});

// Update server by ID (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { pair, chat, status } = req.body;

    // Determine whether to update the pair or chat field based on the request body
    const updateFields = {};
    if (pair) {
      updateFields.pair = pair;
    }
    if (chat) {
      updateFields.chat = chat;
    }
    if (status) {
      updateFields.status = status;
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found x" });
    }

    res.json({ message: "Document updated successfully", conversation: updatedConversation });
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete server by ID
router.delete("/:id", async (req, res) => {
  try {
    const server = await Conversation.findByIdAndDelete(req.params.id);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    res.json({ message: "Server deleted successfully", server });
  } catch (err) {
    console.error("Error deleting server:", err);
    res.status(500).json({ error: "Failed to delete server" });
  }
});


module.exports = router