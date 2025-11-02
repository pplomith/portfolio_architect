const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

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

app.post('/api/sendEmail',async  (req, res) => {
  const { fullName, email, message, privacy } = req.body;
  console.log(req.body);
  res.json({ success: true, message: 'Email inviata con successo' });
});


// Avvio del server
app.listen(PORT, () => {
  console.log(`🏗️  Server attivo su http://localhost:${PORT}`);
  console.log(`📁  Serving files da ${__dirname}`);
});

module.exports = app;
