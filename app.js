const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const dbConnect = require("./config/db");

const conversationsAPI = require("./src/routes/conversationRoutes");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Your Express routes
app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.use("/chat", conversationsAPI);

const axios = require("axios");

// WebSocket server logic
let connectedClients = 0;

// Counter for assigning unique IDs to clients
let clientIdCounter = 0;
const clientsonline = [];

let servers = [];

const getData = async () =>{
  axios
  .get(`${import.meta.env.url}/chat`)
  .then((response) => {
    console.log("Data retrieved successfully:", response.data);
    servers = response.data;
  })
  .catch((error) => {
    console.error("Error retrieving data:", error.message);
  });
}
getData()



wss.on("connection", function connection(ws) {
  // Assign a unique ID to the connected client
  const clientId = ++clientIdCounter;

  //add the id
  clientsonline.push(clientId);

  const postData = {
    server: clientId,
    pair: [clientId],
    chat: [{ message:'*** Connecting you to a stranger, please wait... ***', user: 0 }],
    status: 0
  };
  
  async function updateOrCreateServer() {
    try {
      if (servers.length >= 1) {
        let serverWithSpace = servers.find((item) => item.pair.length < 2);
  
        if (serverWithSpace) {
          // Make a PATCH request to update the server with the new clientId
          const response = await axios.patch(`${import.meta.env.url}/${serverWithSpace._id}`, {
            pair: [...serverWithSpace.pair, clientId],
            chat: [...serverWithSpace.chat, { message:'*** You are now connected, say Hi. ***', user: 0 }],
            status: 0
          });
          console.log(response.data.message); // Should print "Client added to server successfully"
        } else {
          // No server with available space, add a new server
          const response = await axios.post(`${import.meta.env.url}/chat`, postData);
          console.log(response.data.message); // Should print "Server created successfully"
        }
      } else {
        // No servers available, add a new server
        const response = await axios.post(`${import.meta.env.url}/chat`, postData);
        console.log(response.data.message); // Should print "Server created successfully"
      }
  
      // Assuming getData() is an asynchronous function, you may want to await it as well
      await getData();

    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  // Call the function
  updateOrCreateServer();
 

  // Increment the connected clients count
  connectedClients++;

  // Log to the console when a client connects
  console.log(
    `WebSocket connected. Client ID: ${clientId}. Total connected clients: ${connectedClients}`
  );

  // Send an initial message to the connected client
  ws.send(clientId);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`a user has connected`);
    }
  });

  // Handle incoming messages from the client
  ws.on("message", function message(message) {
    let stringMessage = String(message);
    // Find the conversation (convo) associated with the client ID
    const addChat = async () =>{
      try {
        let convo = servers.find((item) => item.pair.includes(clientId));

        // Add the string message to the conversation's chat array
        if (stringMessage!=='!@#$%^&*') {
          // Make a PATCH request to update the server with the new clientId
          const response = await axios.patch(`${import.meta.env.url}/chat/${convo._id}`, {
            chat: [...convo.chat, {user:clientId, message: stringMessage}],
          });
          getData(); 
        }
      } catch (error) {
        console.log(error)
      }
    }
     addChat()

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // Ensure the message is always a string

        // Send the message to the client with the client's ID prefixed
        client.send(`${clientId}${stringMessage}`);

        // Log the updated state of servers (for debugging purposes)
        console.log("servers:", JSON.stringify(servers, null, 2));
      }
    });
  });

// Handle client disconnection
ws.on("close", function close() {
  // Decrement the connected clients count
  connectedClients--;
  const indexToRemove = clientsonline.indexOf(clientId);
  if (indexToRemove !== -1) {
    clientsonline.splice(indexToRemove, 1);
  }

  // Log disconnection information to the server console
  console.log(
    `WebSocket disconnected. Client ID: ${clientId}. Total connected clients: ${connectedClients}`
  );

  // Send a message to the client
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send('user disconnected');
    }
  });

  const deleteConvo = async () => {
    try {
      let convo = await servers.find((item) => item.pair.includes(clientId));
        convo.pair.push(0)
        const disconnected = await axios.patch(
          `${import.meta.env.url}/chat.${convo._id}`,
          {
            pair: convo.pair,
            chat: [
              ...convo.chat,
              { user: clientId, message: '***User Disconnected***' },
            ],
          }
        );
        console.log(convo.pair)
        if(convo.pair.length===2 && convo.pair.includes(0) || convo.pair.length===4){
          const disconnected = await axios.delete(
            `${import.meta.env.url}/chat/${convo._id}`
          );
        }
    } catch (error) {
      console.log(error.data);
    }
    
  };

  deleteConvo();
  
  //getData();



});



  ws.on("error", console.error);
});

// Database connection
dbConnect();

// Start the combined server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
