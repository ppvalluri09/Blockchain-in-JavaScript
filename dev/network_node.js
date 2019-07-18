// Node code

var express = require('express');
var app = express();
const body_parser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');

const node_address = uuid().split('-').join('');

const pipercoin = new Blockchain();

// const port = process.env.PORT || 8080;
const port = process.argv[2];

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.get('/blockchain', (req, res) => {
	res.send(pipercoin);
});


app.post('/transaction', (req, res) => {
	const new_transaction = req.body;
	const block_index = pipercoin.addTransactionToPendingTransactions(new_transaction);
	res.json({ note: `Transaction has been received and updated at index ${ block_index }` });
});


app.post('/transaction/broadcast', (req, res) => {
	const new_transaction = pipercoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	pipercoin.addTransactionToPendingTransactions(new_transaction);

	const request_promises = [];
	pipercoin.network_nodes.forEach(network_node_url => {
		const request_promise_options = {
			uri: network_node_url + '/transaction',
			method: 'POST',
			body: new_transaction,
			json: true
		};

		request_promises.push(rp(request_promise_options));
	});

	Promise.all(request_promises)
	.then(data => {
		res.json({ note: 'The transaction has been added and Broadcasted successfully' });
	})
});


app.get('/mine', (req, res) => {

	const prev_block = pipercoin.getLastBlock();
	const prev_hash = prev_block.hash;	// Previous Hash

	const current_block_data = {
		transactions: pipercoin.pending_transactions,
		index: prev_block.index + 1
	};

	const nonce = pipercoin.proofOfWork(prev_hash, current_block_data);
	const hash = pipercoin.hashBlock(prev_hash, current_block_data, nonce);

	const new_block = pipercoin.createNewBlock(nonce, prev_hash, hash);

	const request_promises = [];
	pipercoin.network_nodes.forEach(network_node_url => {
		const request_promise_options = {
			uri: network_node_url + '/receive-new-block',
			method: 'POST',
			body: new_block,
			json: true
		};

		request_promises.push(rp(request_promise_options));
	});

	Promise.all(request_promises)
	.then(data => {
		const request_options = {											// Miner's Reward
			uri: pipercoin.current_node_url + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: node_address
			},
			json: true
		}
		
		return rp(request_options)
	})
	.then(data => {
		res.json({
			note: 'Block Mined and Broadcasted',
			block: new_block
		});
	})
});


app.post('/receive-new-block', (req, res) => {
	const new_block = req.body;
	const last_block = pipercoin.getLastBlock();
	const correct_block_hash = last_block.hash === new_block.prev_hash;
	const correct_index = (last_block.index + 1) === new_block.index;
	if (correct_block_hash && correct_index) {
		pipercoin.chain.push(new_block);
		pipercoin.pending_transactions = [];
		res.json({ 
			note: 'Block has been received and updated.', 
			block_accepted: new_block
		});
	} else {
		res.json({ 
			note: 'Block Rejected',
			rejected_block: new_block
		});
	}

});


// End-Point to register a new Node onto the Network and Broadcast using one random node in the network...
app.post('/register-and-broadcast-node', (req, res) => {
	const new_node_url = req.body.new_node_url;

	if (pipercoin.network_nodes.indexOf(new_node_url) == -1)
		pipercoin.network_nodes.push(new_node_url);

	const register_node_promises = [];
	pipercoin.network_nodes.forEach(network_nodes_url => {
		const request_promise_options = {
			uri: network_nodes_url + '/register-node',
			method: 'POST',
			body: { new_node_url: new_node_url },
			json: true
		};

		register_node_promises.push(rp(request_promise_options));
	});

	Promise.all(register_node_promises).then(data => {
		const bulkRegisterOptions = {
			uri: new_node_url + '/register-nodes-bulk',
			method: 'POST',
			body: { all_network_nodes: [...pipercoin.network_nodes, pipercoin.current_node_url] },
			json: true
		};

		return rp(bulkRegisterOptions)
	}).then(data => {
		res.json({ note: 'New node registered to the Network Successfully' });
	});
});

// End-Point to register the new node to the network through the used node in the Network (let's call it Host Node)
app.post('/register-node', (req, res) => {
	const new_node_url = req.body.new_node_url;
	const does_not_exist = pipercoin.network_nodes.indexOf(new_node_url) === -1;
	const not_same_node = pipercoin.current_node_url !== new_node_url;

	if (does_not_exist && not_same_node)
		pipercoin.network_nodes.push(new_node_url);

	res.json({ note: 'The new node is successfully registered with this Node' });
});

// End-Point to send a signature to the new Node and register all the current nodes in the network to the node...
app.post('/register-nodes-bulk', (req, res) => {
	const network_nodes_urls = req.body.all_network_nodes;

	network_nodes_urls.forEach(network_node_url => {
		const does_not_exist = pipercoin.network_nodes.indexOf(network_node_url) === -1;
		const not_same_node = pipercoin.current_node_url !== network_node_url;

		if (does_not_exist && not_same_node)
			pipercoin.network_nodes.push(network_node_url);
	});

	res.json({ note: 'Block registration successful' });
});


app.listen(port, () => {
	console.log('Server running on Port: ' + port);
});


app.get('/consensus', (req, res) => {

	const request_promises = [];
	pipercoin.network_nodes.forEach(network_node_url => {
		const request_options = {
			uri: network_node_url + '/blockchain',
			method: 'GET',
			json: true
		}

		request_promises.push(rp(request_options));
	});

	Promise.all(request_promises)
	.then(blockchains =>{
		const current_blockchain_length = pipercoin.chain.length;
		const max_chain_length = current_blockchain_length;
		const new_longest_chain = null;
		const new_pending_transactions = null;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > max_chain_length) {
				max_chain_length = blockchain.chain.length;
				new_longest_chain = blockchain.chain;
				new_pending_transactions = blockchain.pending_transactions;
			}
		});
	})

	if (!new_longest_chain || (new_longest_chain && !pipercoin.chainIsValid(new_longest_chain))) {
		res.json({
			note: 'The Block has not been updated due to corrupted Data',
			chain: new_longest_chain
		})
	} else if (new_longest_chain && pipercoin.chainIsValid(new_longest_chain)) {
		pipercoin.chain = new_longest_chain;
		pipercoin.pending_transactions = new_pending_transactions;
		res.json({
			note: 'The corrupted blockchain was replaced with the correct one.',
			chain: pipercoin.chain
		});
	}
});