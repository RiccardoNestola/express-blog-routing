const posts  = require("../db/db");
const fs = require("fs");
const path = require("path");



function index(req, res) {
    res.format({
      'text/html': function () {
        let htmlContent = fs.readFileSync(path.resolve(__dirname, "../pages/posts.html"), "utf-8");
        let headContent = fs.readFileSync(path.resolve(__dirname, "../head.html"), "utf-8");
        htmlContent = htmlContent.replace("@head", headContent);
   /*      res.type("html").send(htmlContent); */
        
        let htmlOutput = posts.map(post => {
          return `
                
                  <div class="col-33">
                    <div class="card">
                      <img class="img-res" src="/imgs/posts/${post.image}" alt="">
                      <div class="p-2">
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                        <p># ${post.tags.join(', ')}</p>
                      </div>
                    </div>
                  </div>

              `;
            }).join('');

        htmlContent = htmlContent.replace("@posts", htmlOutput);

        res.send(htmlContent);
        
      },
      'application/json': function () {
        res.json(posts);
      },
      'default': function () {
        res.status(406).send('Not Acceptable');
      }
    });
}

function show(req, res) {
  
  const post = findOrFail(req, res);

  res.json(post);
}


function create(req, res) {
  res.format({
    html: () => {
      html = "<h1>Crea Nuovo Post</h1>"
      res.send(html);
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    }
  })

}


function download(req, res) {
  const post = findOrFail(req, res);

  const imagePath = path.resolve(__dirname, '..', 'public', 'imgs', 'posts', post.image);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('Foto non trovata');
      return;
    }
  })

  res.download(imagePath);

}


function findOrFail(req, res) {

  const postsSlug = req.params.slug;

  const post = posts.find((post) => post.slug == postsSlug);

  if (!post) {
    res.status(404).send(`Post ${postsSlug} non trovato`);
    return; 
  }

  return post;
}



module.exports = {
  index,
  show,
  create,
  download

}

