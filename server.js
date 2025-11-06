const express = require('express');
const path = require('path');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const app = express();
const dotenv = require('dotenv');
require('dotenv').config();
app.use(helmet());  
const PORT = process.env.PORT || 3000;
var fs = require('fs');


var portfolioData = JSON.parse(fs.readFileSync('project_data.json', 'utf8'));



// Configurazione EJS come template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware per file statici
app.use(express.static(path.join(__dirname, 'public')));

// Middleware per parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dati del portfolio


app.get('/index', (req, res) => {
  res.render('index', { data: portfolioData });
});
// Routes
app.get('/', (req, res) => {
  res.render('index', { data: portfolioData });
});

app.get('/api/slideData', (req, res) => {
  res.json(portfolioData.slideData);
});

app.get('/api/projects', (req, res) => {
  res.json(portfolioData.projects);
});

app.get('/project/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = portfolioData.projects.find(p => p.id === projectId);
  
  if (project) {
    res.render('project', { project: project, data: portfolioData });
  } else {
    res.status(404).render('404', { data: portfolioData });
  }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
});

app.post('/api/sendEmail',async  (req, res) => {
  try {
  const { to, fromEmail, name, subject, message, cc } = req.body;
  console.log(req.body);
  console.log('GMAIL_USER:', process.env.GMAIL_USER);

  await transporter.sendMail({
            from: fromEmail,
            to: process.env.GMAIL_USER,
            cc: cc || undefined,
            subject: subject,
            html: `
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${fromEmail}</p>
                <p><strong>Messaggio:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: fromEmail,
            subject: 'Conferma ricezione - Portfolio',
            html: `
                <p>Ciao ${name},</p>
                <p>Abbiamo ricevuto il tuo messaggio. Ti risponderò al più presto.</p>
                <p>Grazie!</p>
                <br></br>
                <p>Architetto Giovanna Emanuela Plomitallo</p>
                
            `
        });
  res.json({ success: true, message: 'Email inviata con successo' });
  } catch (error) {
        console.error('Errore:', error);
        res.json({ success: false, error: error.message });
    }
});


// Avvio del server
app.listen(PORT, () => {
  console.log(`🏗️  Server attivo su http://localhost:${PORT}`);
  console.log(`📁  Serving files da ${__dirname}`);
});

module.exports = app;
