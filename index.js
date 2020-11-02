// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
	db.find()
		.then(hubs => {
			res.status(200).json({ hubs });
		})
		.catch(err => {
			res.status(500).json({
				errorMessage: 'The users information could not be retrieved.',
				err
			});
		});
});

server.post('/api/users', (req, res) => {
	const user = req.body;
	console.log(user);

	db.insert(user)
		.then(hub => {
			if (user.name && user.bio) {
				res.status(201).json({ hub });
			} else {
				res
					.status(400)
					.json({ errorMessage: 'Please provide name and bio for the user.' });
			}
		})
		.catch(err => {
			res.status(500).json({
				errorMessage: 'There was an error while saving the user to the database'
			});
		});
});

server.get('/api/users/:id', (req, res) => {
	const { id } = req.params;

	db.findById(id)
		.then(user => {
			if (user) {
				res.status(201).json({ user });
			} else {
				res.status(404).json({
					message: 'The user with the specified ID does not exist.'
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				errorMessage: 'The user information could not be retrieved.'
			});
		});
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	db.remove(id)
		.then(user => {
			if (user) {
				res.status(204).end;
			} else {
				res.status(404).json({
					message: 'The user with the specified ID does not exist.'
				});
			}
		})
		.catch(err => {
			res.status(500).json({ errorMessage: 'The user could not be removed' });
		});
});

server.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const updatedUser = req.body;
	// console.log(newUser);
	db.update(id, updatedUser)
		.then(user => {
			if (user) {
				console.log('USER:', user);

				if (updatedUser.name && updatedUser.bio) {
					res.status(204).json({ user });
				} else {
					res.status(400).json({
						errorMessage: 'Please provide name and bio for the user.'
					});
				}
			} else {
				res.status(404).json({
					message: 'The user with the specified ID does not exist.'
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				errorMessage: 'The user information could not be modified.'
			});
		});
});

server.listen('4000', () => {
	console.log('Listening on port 4000');
});
