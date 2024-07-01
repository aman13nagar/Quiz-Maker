const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routers/authRoutes');
const quizRoutes = require('./routers/quizzesRoutes');
const resultRoutes=require('./routers/resultRoutes');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api',resultRoutes);
app.get('/',async(req,res)=>{
    res.send('hello');
})
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
