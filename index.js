const express = require('express');
require('dotenv').config();
const cors = require('cors')
const app = express();
const nodemailer = require("nodemailer");
const port = process.env.PORT || 5000;


//middleware:
app.use(express.json());
app.use(cors())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3g7cuab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.APP_PASS,
    },
});


// const mailOptions = {
//     from: process.env.APP, // sender address
//     to: "mdsoponhossain2388@gmail.com", // list of receivers
//     subject: "message from portfolio", // Subject line
//     text: "Hello world?", // plain text body
//     html: `<b>${messageInfo?.sender_email}</b> <b>${messageInfo?.text}</b>`,
// }
const sendMail = async (transporter, mailOptions)=>{
    try {
        await transporter.sendMail(mailOptions);
        console.log('mail sent...')
    } catch (error) {

    }
}

async function run() {
    try {
        const database = client.db("Portfolio_DB");
        const db_collection = database.collection("Users");

        //health route:
        app.get('/', (req, res) => {
            res.send('Portfolio server Okay...')
        })

        // find all user:
        app.get('/user', async (req, res) => {
            const result = await db_collection.find().toArray();
            res.send(result)
        })

        //post a user:
        app.post('/user', async (req, res) => {
            console.log(req.body, 'console from the body text...')
            const result = await db_collection.insertOne(req?.body);
            res.send(result)
        })
        //send email:
        app.post('/message', async (req, res) => {
            // console.log(req.body, 'console from the body text...')
            const sender_email = req?.body?.email;
            const sender_name = req?.body?.name;
            const text = req?.body?.message;
            if (sender_email && sender_name && text) {
                const mailOptions = {
                    from: process.env.SENDER_MAIL, // sender address
                    to: "mdsoponhossain2388@gmail.com", // list of receivers
                    subject: "message from portfolio", // Subject line
                    text: "Hello world?", // plain text body
                    html: `<h1>Sender Name: ${sender_name}</h1> <h1>Sender Email: ${sender_email}</h1> <h1>Message:  ${text}</h1>`,
                }

                sendMail(transporter, mailOptions)
                res.send({ message: 'successful' })
            } else {
                res.send({ message: false })
            }
        })



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error)
    }
}
run().catch(console.dir);







app.listen(port, () => { console.log(`server is running on the port ${port}`) })