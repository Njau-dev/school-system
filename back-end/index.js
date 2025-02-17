require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express()
const path = require('path');
const userRoutes = require('./routes/userRoutes')
const assignmentRoutes = require('./routes/assignmentRoutes')
const submitRoutes = require('./routes/submissionRoutes')
const reportRoutes = require('./routes/reportRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173', 'https://school-system-beta.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userRoutes);
app.use(assignmentRoutes)
app.use(submitRoutes)
app.use(reportRoutes)
app.use(dashboardRoutes)

// Serve static files from the "downloads" directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

//handling 404 error
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404
    next(err)
})


// handling 500 errors
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

//mutler error handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // General errors
        return res.status(500).json({ message: err.message });
    }
    next();
});


// setting up a server
app.listen(process.env.PORT || 4000, function () {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Listening on port ${process.env.PORT}`);
});