var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var fs = require("fs")
const path = require('path');
const GoogleSheet = require('../model/GoogleSheet');
const User = require('../model/User');
const Partner = require('../model/Partner');
const Offer = require('../model/Offer');
const Mailer = require('../model/Mailer');
var moment = require("moment")
var multer = require('multer');
const { json } = require('body-parser');
// var upload = multer({ dest: './public/partners/' })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });





router.get('/', async function (req, res, next) {
  let total = User.count({});
  let page = req.params.page || 0
  let limit = 300;
  let users = await User.find({}).sort({ createdAt: -1 }).skip(page * limit).limit(limit);
  console.log(users);
  // res.json(docs);
  res.render('user-list', { title: 'Profiles', data: users })
  // res.send('welcome to google addons demo 🙏');
});



router.post('/api/partner/upload/:email', upload.single('file'), async (req, res) => {
  console.log("uploading files......");
  try {
    console.log(req.file);
    let filename = req.protocol + "://" + req.headers.host + "/images/" + req.file.filename;
    await Partner.findOneAndUpdate({ email: req.params.email }, { $set: { profilePic: filename } }, { new: true });
    let user = await Partner.findOne({ email: req.params.email });
    let offers = await Offer.find({ partnerId: user.partnerId });
    let ud = Object.assign(user.toObject(), { offers: offers });
    return res.json(ud)
  } catch (error) {
    console.error(error);
  }
})

router.get('/api/users', async function (req, res, next) {
  try {

    let total = await User.count({});
    console.log("....api user....", total);
    let page = req.params.page || 0
    let limit = 300;
    let users = await User.find({});
    console.log(users);
    return res.json({
      total,
      users
    });
  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});

router.get('/partner/:pid', async function (req, res, next) {
  try {

    let partner = await Partner.findOne({ partnerId: req.params.pid });
    console.log(partner);
    if (partner)
      res.render('partner', { partner })
    else
      res.render('error', 'invalid partner')

  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});




router.get('/api/partner/:email', async function (req, res, next) {
  try {
    let user = await Partner.findOne({ email: req.params.email });
    let offers = await Offer.find({ partnerId: user.partnerId });

    // console.log(offers);
    let ud = Object.assign(user.toObject(), { offers: offers });

    console.log(ud);
    return res.json(ud)
  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});


router.post('/api/partner', async function (req, res, next) {
  try {

    console.log("..update partner....");
    let bd = req.body.data;
    let email = req.body.email;
    if (req.body.password !== "ciitizen-2021@usa") {
      throw ("Error Invalid Password");
    }

    let user = await Partner.findOne({ email });
    let partnerId;
    if (!user) {
      partnerId = Math.random().toString();
    } else {
      partnerId = user.partnerId;
    }
    let url = req.protocol + "://" + req.headers.host + "/partner/" + partnerId;

    let toSave = {
      partnerId: partnerId,
      email: req.body.email,
      name: bd[2][1],
      email: email,
      about: bd[3][1],
      category: bd[4][1],
      address: bd[6][1],
      city: bd[1][7],
      state: bd[8][1],
      profilePic: bd[9][1],
      partnerEmail: '',
      partnerName: '',
      adminEmail: bd[12][1],
      adminName: bd[11][1],
      locationCoordinates: bd[26][1],
      orgBio: bd[17][1],
      orgCoverPhoto: "",
      partnerContactNo: bd[26][1],
      templateType: "Partner",
      version: bd[1][1],
      websiteLink: bd[18][1],
      url: url
    }


    console.log("tosave...........................", toSave);
    let pat = await Partner.updateOne({ email }, { $set: toSave }, { upsert: true });
    console.log(pat);
    return res.send(url);
  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});


router.post('/api/offer', async function (req, res, next) {
  try {

    console.log("..update offer....");
    console.log(req.body);
    // let user = await Partner.findOne({ email: req.params.email });
    // let offers = await Offer.find({ partnerId: user.partnerId });
    // // console.log(offers);
    // let ud = Object.assign(user.toObject(), { offers: offers });
    // console.log(ud);
    return res.json({})
  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});


router.get('/api/mailers/:partnerId', async function (req, res, next) {
  try {
    console.log("..load mailers....");
    let total = await Mailer.countDocuments();
    let mailer = await Mailer.find({ partnerId: req.params.partnerId });
    return res.json({
      total,
      mailer
    })
  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});


router.post('/api/mailers', async function (req, res, next) {
  try {
    console.log("..save mailers....");
    console.log(req.body);
    return res.json({});
  } catch (error) {
    return res.json(JSON.stringify(error))
  }
});



// https://dailybits.xyz/images/ciitizen.png


router.get('/documentPublishedURL/:documentId', async function (req, res, next) {
  let documentId = req.params.documentId;
  let doc = await GoogleSheet.findOne({ documentId })

  if (doc) {
    return res.json({
      status: true,
      publicUrl: req.protocol + doc.publicUrl
    })
  } else {
    return res.json({
      status: false,
      publicUrl: null
    })
  }

});

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
  let user = { email: userEmail, name: req.body.name || '', gender: req.body.gender || '', profilePic: req.body.gender === "F" ? "https://dailybits.xyz/images/she.png" : "https://dailybits.xyz/images/he.png", description: req.body.description || '' }

  let fileName = makeTitle(title, documentId) + ".html"
  let appBaseUrl = req.headers.host + "/doc/"
  let appUrl;
  let pTitle = "<title>" + title + "</title>";
  let style = makeCustomStyle();
  let script = makeCustomJS();
  let content = html.split('<head>')
  let newHtml = content[0] + pTitle + style + script + content[1];
  let body = html.split('</body>')
  let lastUpdateDate = moment().format("DD MMM yy");
  let name = "Tania's";
  let profileUrl = "/";

  if (req.body) {
    try {
      let userInDb = await checkUser(user);
      let doc = await GoogleSheet.findOne({ documentId });
      if (doc) {
        fileName = doc.fileName == fileName ? doc.fileName : fileName;
        appUrl = appBaseUrl + fileName
        await GoogleSheet.findOneAndUpdate({ documentId }, { title, publicUrl: appUrl, fileName, userEmail })
      } else {
        appUrl = appBaseUrl + fileName
        await GoogleSheet.create({ documentId, title, publicUrl: appUrl, fileName, userEmail })
      }

      let _extraHtml = makeBodyHtml(lastUpdateDate, name, appUrl, "/user/" + userInDb.username);
      let _temp1 = newHtml.split("<body");
      let _temp2 = _temp1[1].split('>');
      let _temp3 = "<body " + _temp2[0] + ">";
      _temp2.shift();
      newHtml = _temp1[0] + _temp3 + _extraHtml + _temp2.join(">");
      let fwrite = await fs.writeFileSync("./public/doc/" + fileName, newHtml)
      if (!doc)
        await updateDocumentCount(userInDb);

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

router.get('/user/:username', async function (req, res, next) {
  let username = req.params.username;
  let user = await User.findOne({ username })
  if (user) {
    let docs = await GoogleSheet.find({ userEmail: user.email })
    console.log("*****************docs.........", docs, user.email);
    res.render('user-profile', { title: 'Users', user: user, data: docs })
  }

});






async function checkUser(user) {
  let _user = await checkIfUserExists(user.email)
  if (!_user) {
    _user = await createNewUser(user)
  }
  return _user;
}

async function checkIfUserExists(email) {
  return await User.findOne({ email });
}

async function createNewUser(user) {
  user.username = generateUserName(user.name)
  return await User.create(user);
}

function makeTitle(title, documentId) {
  return title.trim().split(" ").join("_").toLowerCase() + "_" + documentId;
}


function makeBodyHtml(lastUpdateDate, name, url, profileUrl) {
  return `<div id="toast" class="g-font">link copied</div>
<div style="display: flex;justify-content: space-between;" class="g-font"><a href="https://ciitizen.com"> <img
      src="../images/ciitizen.png" style="width: 40px;" /></a>
  <div style="color:#aaa">Last updated : `+ lastUpdateDate + ` </div>
</div>
<div style="text-align: center;font-size:30px;margin-bottom:30px;" class="g-font"><a href="`+ profileUrl + `" style="color:#444">` + name + ` Notes</a></div>
<div style="position: fixed;left:0px;bottom:0px;height:60px;width:100%">
  <div class="g-font"
    style="max-width: 790px;margin:0 auto;background-color:#fff;border-top:1px solid #ccc ;box-shadow: 0px -4px 3px rgb(0, 0, 0,.1);display: flex;">
    <div style="background-color: #ccc;padding:20px;font-weight: bold;">SHARE</div>
    <div class="share" onclick="copyToClipboard('`+ url + `')">
      <div > Copy Link</div>
    </div>
    <a class="share"
      href="mailto:?subject=Sharing my health note&body=Hi%0D%0A%0D%0AYou can view my health note at this link %0D%0A `+ url + `%0D%0A%0D%0ARegards%0D%0A` + name + `">Email</a>

  </div>
</div>`;
}

function makeCustomStyle() {
  return `
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
  <style type="text/css">
  html {
    background-color: #e8eff74d;
  }

  .g-font {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
  }

  body {
    max-width: 600px !important;
    margin: 0 auto;
    margin-top:-40px !important;
    padding: 20px;
    background-color: #fff !important;
    position: relative;
    padding-bottom: 200px !important;
  }

  #toast {
    left: 50%;
    bottom: 20px;
    border-radius: 20px;
    position: fixed;
    z-index: 9001;
    background-color: black;
    color: #fff;
    padding: 10px 20px;
    display: none;
  }
  .share{
    /* background-color: #ccc; */
    padding:20px;font-weight: bold;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
    color: #434343;
    border-right: 1px solid rgb(238, 235, 235)
  }
  .share:hover{
    color: blueviolet;
    
  }
  </style>
  `;
}

function makeCustomJS() {
  return `  <script>
  function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    document.getElementById('toast').style.display = 'block';
    setTimeout(function () {
      document.getElementById('toast').style.display = "none";
    }, 500)
  }
</script>`;
}

function generateUserName(name) {
  return (name.split(" ").join("") + Math.floor(Math.random() * 100000)).toLowerCase()
}

async function updateDocumentCount(user) {
  await User.findByIdAndUpdate({ _id: user._id }, { $set: { documentCount: user.documentCount + 1 } });
}
module.exports = router;

