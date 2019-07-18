
// Blockchain implementation in JavaScript

const sha256 = require('sha256');
const current_node_url = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {		// Constructor function for Blockchain
	this.chain = [];
	this.pending_transactions = [];

	this.current_node_url = current_node_url;
	this.network_nodes = [];

	this.createNewBlock(100, '0', '0');		// Genesis Block
}

Blockchain.prototype.createNewBlock = function(nonce, prev_hash, hash) {	// Mining of block for completing the transaction
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pending_transactions,
		nonce: nonce,
		hash: hash,
		prev_hash: prev_hash,
	};

	this.pending_transactions = [];		// After mining the transactions we add it to the last block and empty the pending transactions coz there arent any left
	this.chain.push(newBlock);		// Push the mined block into the chain of the blockchain

	return newBlock;
}

Blockchain.prototype.getLastBlock = function() {	// Method to return the last block
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {		// Method to add a transaction to the pending transactions list
	const new_trans = {
		amount: amount,
		sender_address: sender,
		recipient_address: recipient,
		transaction_id: uuid().split('-').join('')
	};
	
	return new_trans;
}

Blockchain.prototype.addTransactionToPendingTransactions = function (transaction_obj) {
	this.pending_transactions.push(transaction_obj);
	return (this.getLastBlock()).index + 1;
}


Blockchain.prototype.hashBlock = function (previous_block_hash, current_block_data, nonce) {
	const dataAsString = previous_block_hash + nonce.toString() + JSON.stringify(current_block_data);
	const hash = sha256(dataAsString);
	return hash;
} 


Blockchain.prototype.proofOfWork = function (prev_block_hash, current_block_data) {
	let nonce = 0;
	let hash = this.hashBlock(prev_block_hash, current_block_data, nonce);

	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(prev_block_hash, current_block_data, nonce);
	}
	return nonce;
}


Blockchain.prototype.chainIsValid = function(blockchain) {
	let is_valid = true;

	for (var i = 1; i < blockchain.length; i++) {
		const current_block = blockchain[i];
		const prev_block = blockchain[i - 1];

		const hash = this.hashBlock(prev_block.hash, { transactions: current_block.transactions, index: current_block.index }, current_block.nonce);

		if (hash.substring(0, 4) != '0000')
			is_valid = false;
		if (prev_block.hash !== current_block.prev_hash)
			is_valid = false;
	}

	const genesis_block = blockchain[0];
	const valid_hash = genesis_block.hash === '0';
	const valid_prev_hash = genesis_block.prev_hash === '0';
	const valid_nonce = genesis_block.nonce === 100;
	const valid_transactions = genesis_block.transactions.length === 0;

	if (!valid_hash || !valid_prev_hash || !valid_transactions || !valid_nonce)
		is_valid = false;

	return is_valid;
}


module.exports = Blockchain;