const express = require("express");
const Book = require("../models/book");
const LatestNews = require("../models/latest_news");
const Message = require("../models/message");
const NewsEvents = require("../models/news_events");
const NewsEventsPhoto = require("../models/news_events_photo");
const Notice = require("../models/notice");
const QuranicVerse = require("../models/quranic_verse");

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

    res.render("index", {
      locals,
      latestNews,
      quranicVerse,
      message,
      newsEvents,
      newsEventsPhoto,
      notice,
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
    });
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

module.exports = router;
