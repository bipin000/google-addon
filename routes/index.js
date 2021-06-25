var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var fs = require("fs")
router.get('/', function (req, res, next) {
  res.send('welcome to google addons demo 🙏');
});

function makeTitle(title) {
  return title.trim().replace(' ', '_').toLowerCase();
}

router.post('/publish', async function (req, res, next) {

  let html = req.body.html;
  let title = req.body.title;
  let password = req.body.password;
  if (password !== "google-demo") {
    return res.json({
      success: false,
      publishUrl: null,
      message: 'invalid password'
    })
  }
  let filename = makeTitle(title) + ".html"
  let appUrl = req.headers.host + "/doc/" + filename
  title = "<title>" + title + "</title>";
  let content = html.split('<head>')
  let newHtml = content[0] + title + content[1];
  if (req.body) {
    try {
      let fwrite = await fs.writeFileSync("./public/doc/" + filename, newHtml)
    } catch (error) {
      return res.json({
        success: false,
        publishUrl: null,
        message: ' error publishing document' + JSON.stringify(error)
      })
    }
  }
  return res.json({
    success: true,
    publishUrl: appUrl,
    message: 'document published successfully'
  })

});

module.exports = router;
