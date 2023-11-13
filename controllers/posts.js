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

module.exports = {
  index,
}

