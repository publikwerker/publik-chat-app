const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))
app.use(express.json());

module.exports = server;