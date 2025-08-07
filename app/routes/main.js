const express = require("express");
const Book = require("../models/book");
const LatestNews = require("../models/latest_news");
const Message = require("../models/message");
const NewsEvents = require("../models/news_events");
const NewsEventsPhoto = require("../models/news_events_photo");
const Notice = require("../models/notice");
const QuranicVerse = require("../models/quranic_verse");
const Committee = require("../models/committee");
const About = require("../models/about");
const Borrow = require("../models/borrow");

const router = express.Router();

/*
    GET
    HOME
*/
router.get("/", async (req, res) => {
  locals = {
    title: "Home",
  };
  let latestNews;
  let quranicVerse = [];
  let message;
  let newsEvents = [];
  let newsEventsPhoto = [];
  let notice = [];
  let galleryPhoto = [];
  try {
    latestNews = await LatestNews.findOne();
    quranicVerse = await QuranicVerse.find();
    message = await Message.findOne();
    const allNewsEvents = await NewsEvents.find().sort({ createdAt: -1 });
    for (let i = 0; i < allNewsEvents.length && i < 3; i++) {
      newsEvents.push(allNewsEvents[i]);
    }
    for (let i = 0; i < newsEvents.length; i++) {
      const obj = await NewsEventsPhoto.findOne({ id: newsEvents[i].id });
      if (obj) newsEventsPhoto.push(obj.photoUrl);
      else newsEventsPhoto.push("/img/logo.png");
    }
    const allNotice = await Notice.find().sort({ createdAt: -1 });
    for (let i = 0; i < allNotice.length && i < 3; i++) {
      notice.push(allNotice[i]);
    }
    const allPhoto = await NewsEventsPhoto.find().sort({ createdAt: -1 });
    // console.log(allPhoto);
    for (let i = 0; i < allPhoto.length && i < 4; i++) {
      galleryPhoto.push(allPhoto[i].photoUrl);
    }
    res.render("index", {
      locals,
      latestNews,
      quranicVerse,
      message,
      newsEvents,
      newsEventsPhoto,
      notice,
      galleryPhoto,
    });
  } catch (err) {
    console.log(err);
    res.render("index", {
      locals,
      latestNews,
      quranicVerse,
      message,
      newsEvents,
      newsEventsPhoto,
      notice,
      galleryPhoto,
    });
  }
});

/*
    GET
    About
*/
router.get("/about", async (req, res) => {
  locals = {
    title: "About",
  };
  try {
    const about = await About.findOne();

    if (!about) throw new Error();

    res.render("about", { locals, about });
  } catch (err) {
    console.log(err);
    locals.title = "Error";
    res.render("error", { locals });
  }
});

/*
    GET
    NOTICE
*/
router.get("/notice", async (req, res) => {
  locals = {
    title: "Notice",
  };
  try {
    const notice = await Notice.find().sort({ createdAt: -1 });

    res.render("notice", { locals, notice });
  } catch (err) {
    console.log(err);
    locals.title = "Error";
    res.render("error", { locals });
  }
});

router.get("/notice/:id", async (req, res) => {
  locals = {
    title: "Notice",
  };
  try {
    const notice = await Notice.findOne({ id: req.params.id });
    if (!notice) throw new Error();
    res.render("singleNotice", { locals, notice });
  } catch (err) {
    console.log(err);
    locals.title = "Error";
    res.render("error", { locals });
  }
});

/*
    GET
    Committee
*/
router.get("/committee", async (req, res) => {
  locals = {
    title: "Committee",
  };
  try {
    const committee = await Committee.findOne();

    if (!committee) throw new Error();

    res.render("committee", { locals, committee });
  } catch (err) {
    console.log(err);
    locals.title = "Error";
    res.render("error", { locals });
  }
});

/*
    GET
    Gallery
*/
router.get("/gallery", async (req, res) => {
  locals = {
    title: "Gallery",
  };
  try {
    const newsEvents = await NewsEvents.find().sort({ createdAt: -1 });
    let newsEventsPhoto = [];
    for (let i = 0; i < newsEvents.length; i++) {
      const obj = await NewsEventsPhoto.findOne({ id: newsEvents[i].id });
      if (obj) newsEventsPhoto.push(obj.photoUrl);
      else newsEventsPhoto.push("/img/logo.png");
    }
    res.render("gallery", { newsEvents, newsEventsPhoto });
  } catch (err) {
    console.log(err);
    locals.title = "Error";
    res.render("error", { locals });
  }
});

router.get("/gallery/:id", async (req, res) => {
  locals = {
    title: "Gallery",
  };
  try {
    const newsEvent = await NewsEvents.findOne({ id: req.params.id });
    if (!newsEvent) throw new Error();
    const newsEventPhoto = await NewsEventsPhoto.find({ id: req.params.id });
    if (newsEventPhoto.length === 0) throw new Error();
    res.render("singleNewsEvent", { locals, newsEvent, newsEventPhoto });
  } catch (err) {
    console.log(err);
    locals.title = "Error";
    res.render("error", { locals });
  }
});

/*
    GET
    LIBRARY
*/
router.get("/library", async (req, res) => {
  locals = {
    title: "Library",
  };
  try {
    const books = await Book.find().sort({ id: 1 });
    res.render("library", { locals, books });
  } catch (err) {
    console.log(err);
    res.render("library", { locals, books: [] });
  }
});

router.post("/search", async (req, res) => {
  try {
    locals = {
      title: "Library",
    };
    const searchTerm = req.body["search-term"]?.trim();
    const searchNoSpecialChar = searchTerm.replace(
      /[^\u0980-\u09FFa-zA-Z0-9 ]/g,
      ""
    );
    const books = await Book.find({
      $or: [
        { id: { $regex: searchNoSpecialChar, $options: "i" } },
        { description: { $regex: searchNoSpecialChar, $options: "i" } },
      ],
    });

    if (!books || books.length === 0) throw new Error();
    res.render("library", {
      books,
      locals,
    });
  } catch (error) {
    console.log(error);
    res.render("notFound");
  }
});


router.get('/borrow', (req, res) => {
  locals = {
    title: 'Borrow Book'
  };
  try {
    res.render('borrow', { locals });
  } catch (err) {
    console.log(err);
    res.render('error');
  }
});

router.post('/borrow', async (req, res) => {
  
  locals = {
    title: 'Borrow Book'
  };
  try {
    if (!req.body['book-id-upload']?.trim() || !req.body['name-upload']?.trim() || !req.body['contact-upload']?.trim())
      throw new Error();

    const bookId = req.body['book-id-upload']?.toUpperCase().trim();
    const name = req.body['name-upload'];
    const contact = req.body['contact-upload'];

    const newBorrow = new Borrow({
      contact,
      name,
      bookId,
    });
    await Borrow.create(newBorrow);

    res.render('submissionSuccessful');

  } catch (err) {
    console.log(err);
    res.render('error');
  }
});



module.exports = router;
