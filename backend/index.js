const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

app.use(cors())
app.use(express.json())
const connect = require('./db')

connect()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"})

const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login')
const homeRoutes = require('./routes/home')
const sellRoutes = require('./routes/sell')
const buyRoutes = require('./routes/buy')
const itemRoutes = require('./routes/item')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const deliverRoutes = require('./routes/deliver')


app.use('/signup',signupRoutes)
app.use('/login',loginRoutes)
app.use('/home',homeRoutes)
app.use('/sell',sellRoutes)
app.use('/buy',buyRoutes)
app.use('/item',itemRoutes)
app.use('/cart',cartRoutes)
app.use('/order',orderRoutes)
app.use('/deliver',deliverRoutes)   
app.get('/',(req,res)=>{
    res.send(`Welcome to the home page.
        Login/Signup to get Started.`) //chhod bhai tu kaam ka nhi h skill iusse
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


const Sessions = new Map();

app.post('/chat', async (req, res) => {
    console.log("WELCOME TO chatbot");
    try {
        const { message, sessionId, history } = req.body;
        let curr_session = Sessions.get(sessionId);

        if (!curr_session) {
            curr_session = model.startChat({
                history: []
            });
            Sessions.set(sessionId, curr_session); // Store the session
        }

        console.log('Sending message:', message);
        const response = await curr_session.sendMessage(message);
        // console.log(response)
        const text = response.response.candidates[0].content; 
        console.log("RESPONSE BOLTE",text)
        res.json({ response: text }); 
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to process chat message" });
    }
});