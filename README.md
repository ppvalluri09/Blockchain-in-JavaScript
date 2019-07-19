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

Start Up your nodes using the command in your directory of the Project<br/><br/>
![Screenshot (47)](https://user-images.githubusercontent.com/44934630/61467607-8a7c4080-a999-11e9-8c42-805ed26b8784.png)

Goto the following end-point in your Browser and you see your blockchain with you Genesis Block alone<br/><br/>

![Screenshot (48)](https://user-images.githubusercontent.com/44934630/61467635-936d1200-a999-11e9-852b-2b09f3e8b90b.png)

Connect your other nodes together through a POST request from POSTMAN<br/><br/>

![Screenshot (49)](https://user-images.githubusercontent.com/44934630/61467650-99fb8980-a999-11e9-8390-e629bf40db35.png)

You can see the same Blockchain on all network nodes<br/><br/>

![Screenshot (50)](https://user-images.githubusercontent.com/44934630/61467662-9ec03d80-a999-11e9-97b4-99913092b48f.png)

Now add a new Transaction using POSTMAN like below<br/><br/>

![Screenshot (51)](https://user-images.githubusercontent.com/44934630/61467680-a54eb500-a999-11e9-8d2e-8501c4f33be3.png)

You can see the transaction has been added to the pending_transactions list<br/><br/>

![Screenshot (52)](https://user-images.githubusercontent.com/44934630/61467689-ad0e5980-a999-11e9-8111-32de66e988f7.png)

Now use the mine end point to mine the Blockchain<br/><br/>

![Screenshot (53)](https://user-images.githubusercontent.com/44934630/61467696-b39cd100-a999-11e9-9161-f0a2dc78b3d3.png)

You can see that the end-point returns a mined block who's data is as shown<br/><br/>

![Screenshot (54)](https://user-images.githubusercontent.com/44934630/61467714-bac3df00-a999-11e9-8d00-e1abc0492cc9.png)

See that the transaction was mined and added to the chain and pending transactions consists of a new transaction, which is the miner's reward for mining the Block<br/><br/>

![Screenshot (55)](https://user-images.githubusercontent.com/44934630/61467725-c0b9c000-a999-11e9-8e43-57d0f96ce54d.png)

Verify for the consistency of the Blockchain by checking the other blocks also, we can see that all the nodes have the updated Data, making sure that our Peer-to-Peer network is working perfectly<br/><br/>

![Screenshot (56)](https://user-images.githubusercontent.com/44934630/61467739-c6170a80-a999-11e9-802e-0c885d2a206b.png)

# Conclusion

There we go, our very own Decentralised Blockchain Network in JavaScript which replicates the Bitcoin Blockchain network and works without any flaw... Moreover it is also very secure because of the implementation of the Proof-Of-Work... And we can ensure Data Consistency and lack of fake/false data due to the implementation of the Consensus Algorithm (Longest-Chain-Length).


# Author
Valluri Pavan Preetham (@ppvalluri09)
