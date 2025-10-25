const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione EJS come template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware per file statici
app.use(express.static(path.join(__dirname, 'public')));

// Middleware per parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dati del portfolio
const portfolioData = {
  siteTitle: 'Giovanna E. Plomitallo - Architetto',
  hero: {
    title: 'PERSONALIZE AND CUSTOMIZE',
    subtitle: 'View Project'
  },
  about: {
    sectionLabel: '— WHO I AM',
    title: 'About Me',
    paragraphs: [
      'Amet, consectetur adipiscing elit. Commodo viverra eu volutpat amet, leo ultrici non senectus odio dolor. Id at urna non porttitor elentum. Viverra senectus lorem ipsum dolor sit adui ultricies dolor varius nibh velit viverra euen.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo viverra eu volutpat amet, leo non senetus odio dolor. Id at urna non porttitor etum. Vivera senectus elit dui ultricies dolor. Varius nibh velit pellentesque sapien, sapien neque dignissim.',
      'Commodo vivera eu volutpat amet, leo non senectus odio dolor. Id at urna non porttitor elementum. Viverra senectus dui ultricies dolor.'
    ]
  },
  projects: [
    { id: 1, title: 'Progetto Residenziale', description: 'Villa moderna con design sostenibile' },
    { id: 2, title: 'Centro Commerciale', description: 'Spazio commerciale innovativo' },
    { id: 3, title: 'Uffici Corporate', description: 'Torre per uffici con certificazione LEED' }
  ]
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { data: portfolioData });
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

// Avvio del server
app.listen(PORT, () => {
  console.log(`🏗️  Server attivo su http://localhost:${PORT}`);
  console.log(`📁  Serving files da ${__dirname}`);
});

module.exports = app;
