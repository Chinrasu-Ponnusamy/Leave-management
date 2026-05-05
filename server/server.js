require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/leave-types', require('./routes/leaveTypes.routes'));
app.use('/api/leave-requests', require('./routes/leaveRequests.routes'));
app.use('/api/leave-balances', require('./routes/balances.routes'));

app.listen(3000, () => console.log("Server running on port 3000"));