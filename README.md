# Decentralized Blockchain Network

A decentralized network implemented in JavaScript...

This project has two segments:
  
  - Blockchain
  - Peer to Peer Decentralized network
  
The first part which is the Blockchain is implemented as a Constructor function having the objects:
  
  - Chain
  - Pending Transactions
  - Current Node URL (This is for the Peer-to-Peer network)
  - Network Nodes (This is for the Peer-to-Peer network)
  
The Blockchain also has the following methods:

  - createNewBlock()
  - hashBlock()
  - createNewTransaction()
  - getLastBlock()
  - chainIsValid()
  - addTransactionToPendingTransactions
  - proofOfWork()
  
The second part of the project consists of the Peer-to-Peer network implemented using Node.js, Express.js, Nodemon, Body-Parser, Request-Promise libraries... To be able to use this module, first install all the dependencies:

                                                npm install express --save
                                                npm install sha256 --save
                                                npm install request-promise --save
                                                npm install nodemon --save
                                                npm install body-parser --save
                                                
These modules are a must for the Network to function...

So the network_node.js is the code for each node in the network. The methods GET and POST were used to implement the connection of these Nodes using their URLs...

Since we are testing this on our local computer, I have modified my package.json file such that I can run each node of my network on a different PORT and get the URL and Port number using the command line arguments...

My network_node.js file consists of the following end-points:

  - '/blockchain' - returns the Blockchain Data Structure
  - '/transaction' - Performs a transaction and adds it to the Pending Transactions
  - '/mine' - This end-point uses the Proof-Of-Work to calculate the Hash and Nonce and creates a new block using the createNewBlock() method and adds the resulting block to the blockchain's chain...
  - '/register-and-broadcast-node' - To register a new node and broadcast it to the other nodes in the network for them to register it
  - '/register-node' - To register a new node with a particular node
  - '/register-nodes-bulk' - To register the existing nodes in the network with the new node to be added to the network
  - '/consensus' - To use the chainIsValid() method to apply the consensus algorithm or the longest chain rule to validate the blockchain with the blockchain data present in the other nodes...
  
  
# Usage

One can use and test this network by using an application called POSTMAN which is used to perform POST requests to the Nodes...
And also feel free to change the name of the currency implemented, I'm a huge fan of Silicon Valley so I have named it PiperCoin...

# SnapShots



# Author
Valluri Pavan Preetham (@ppvalluri09)
