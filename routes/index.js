var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var fs = require("fs")
const path = require('path');
const GoogleSheet = require('../model/GoogleSheet');

router.get('/', async function (req, res, next) {


  let total = GoogleSheet.count({});
  let page = req.params.page || 0
  let limit = 10;
  let docs = await GoogleSheet.find({}).sort({ createdAt: -1 }).skip(page * limit).limit(limit);

  // res.json(docs);

  res.render('index', { title: 'Published Documents', data: docs })





  // res.send('welcome to google addons demo 🙏');
});

function makeTitle(title, documentId) {
  return title.trim().split(" ").join("_").toLowerCase() + "_" + documentId;
}


router.post('/publish', async function (req, res, next) {

  let html = req.body.html;
  let title = req.body.title;

  let password = req.body.password;
  let documentId = req.body.documentId;
  let userEmail = req.body.userEmail;
  if (!title) {
    return res.json({ success: false, publishUrl: null, message: 'missing title' })
  }
  if (!html) {
    return res.json({ success: false, publishUrl: null, message: 'missing html' })
  }
  if (!documentId) {
    return res.json({ success: false, publishUrl: null, message: 'missing documentId' })
  }
  let pass = process.env.PASSWORD || "google-demo";
  if (password !== pass) {
    return res.json({ success: false, publishUrl: null, message: 'invalid password' })
  }

  let fileName = makeTitle(title, documentId) + ".html"
  let appBaseUrl = req.headers.host + "/doc/"
  let appUrl;
  let pTitle = "<title>" + title + "</title>";
  let content = html.split('<head>')

  let newHtml = content[0] + pTitle + content[1];
  let body = html.split('</body>')
  let homeLink = "<a href='/' style='position:fixed;top:10px;'>Home</a><div style='margin-top:40px;font-size:13px;'>source : <a href='https://docs.google.com/document/d/" + documentId + "/edit' >https://docs.google.com/document/d/" + documentId + "/edit</a></div>";
  newHtml = body[0] + homeLink + body[1]
  // body[0] +" "+ b2[0] + ">" + homeLink + b2[1];

  if (req.body) {
    try {
      let doc = await GoogleSheet.findOne({ documentId });
      if (doc) {
        fileName = doc.fileName == fileName ? doc.fileName : fileName;
        appUrl = appBaseUrl + fileName
        await GoogleSheet.findOneAndUpdate({ documentId }, { title, publicUrl: appUrl, fileName, userEmail })
      } else {
        appUrl = appBaseUrl + fileName
        await GoogleSheet.create({ documentId, title, publicUrl: appUrl, fileName, userEmail })
      }

      let fwrite = await fs.writeFileSync("./public/doc/" + fileName, newHtml)

    } catch (error) {
      console.error(error)
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
    message: 'documentss published successfully'
  })

});

module.exports = router;
