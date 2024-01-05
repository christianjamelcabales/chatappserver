const express = require("express");
const router = express.Router();
const Server = require("../models/serverModel");

//getAll servers
router.get("/", async (req, res) => {
  const data = await Server.find({});
  res.json(data);
});


//post server
router.post("/", async (req, res) => {
  const newServer = new Server({
    server: req.body.server,
    isAvailable: req.body.isAvailable,
  });

  try {
    await newServer.save();
    res.status(201).json({ message: "Server created successfully" });
  } catch (err) {
    console.error("Error creating server:", err);
    res.status(500).json({ error: "Failed to create server" });
  }
});



// Get server by ID
router.get("/:id", async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
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
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    res.json({ message: "Server updated successfully", server });
  } catch (err) {
    console.error("Error updating server:", err);
    res.status(500).json({ error: "Failed to update server" });
  }
});

// Delete server by ID
router.delete("/:id", async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    res.json({ message: "Server deleted successfully", server });
  } catch (err) {
    console.error("Error deleting server:", err);
    res.status(500).json({ error: "Failed to delete server" });
  }
});

module.exports = router;
