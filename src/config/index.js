const app = require('../..');
const cors = require('cors');
require('dotenv').config();

// Enable CORS for all origins
app.use(cors());
