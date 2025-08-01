const express = require("express");
const router = express.Router();
const upload = require("../db/config/multer");
const Book = require("../models/book");
const LatestNews = require("../models/latest_news");
const Message = require("../models/message");
const NewsEvents = require("../models/news_events");
const NewsEventsPhoto = require("../models/news_events_photo");
const Notice = require("../models/notice");
const QuranicVerse = require("../models/quranic_verse");
const cloudinary = require("../db/config/cloudinary");




// LIBRARY
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

router.get("/admin/library", (req, res) => {
  locals = {
    title: "admin/library",
  };
  res.render("admin/library", { locals });
});

// ADD-BOOK
router.post("/admin/library/addbook", upload.single("book-image-upload"), async (req, res) => {
    locals = {
      title: "admin/library",
    };
    try {
      const bookId = req.body["book-id-upload"] ?.toUpperCase();
      const bookDescription = req.body["book-description-upload"];
      const bookStatus = req.body["book-status-upload"];

        if (!bookId || !bookDescription || !bookStatus || !req.file) {
            throw new Error();
        }
      const bookImageUrl = req.file.path;
      const bookImageId = req.file.filename;

      const newBook = new Book({
        id: bookId,
        photo: {
          url: bookImageUrl,
          id: bookImageId,
        },
        description: bookDescription,
        status: bookStatus,
      });

      await Book.create(newBook);

      res.render("admin/library", { locals });
    }
    catch (err) {
      console.error(err);
      res.render("admin/library", { locals });
    }
  }
);

// REMOVE-BOOK
router.post("/admin/library/removebook", async (req, res) => {
    locals = {
      title: "admin/library",
    };
  try {
    const bookId = req.body["book-id-remove"].toUpperCase();

      if (!bookId) {
          throw new Error();
      }
      
    const obj = await Book.findOne({ id: bookId });
    const imageId = obj.photo.id;

      if (!imageId) {
          throw new Error();
    }
    
    // console.log(imageId);

    await Book.deleteOne({ id: bookId });
    await cloudinary.uploader.destroy(imageId);
      
    res.render("admin/library", { locals });
  }
  catch (err) {
    console.error(err);
    res.render("admin/library", { locals });
  }
});

// UPDATE-BOOK
router.post("/admin/library/updatebook", upload.single("book-image-update"), async (req, res) => {
    locals = {
      title: "admin/library",
    };
    try {
        const bookId = req.body["book-id-update"]?.toUpperCase();
        if (!bookId) throw new Error();

        const book = await Book.findOne({ id: bookId });
        if (!book) throw new Error();

        // Update only if value is provided
        if (req.body["book-description-update"]) {
          book.description = req.body["book-description-update"];
        }
        if (req.body["book-status-update"]) {
          book.status = req.body["book-status-update"];
        }

        // Update image if a new file is uploaded
        if (req.file) {
          await cloudinary.uploader.destroy(book.photo.id);

          book.photo = {
            url: req.file.path,
            id: req.file.filename,
          };
        }

        await book.save();

      res.render("admin/library", { locals });
    } catch (err) {
      console.error(err);
      res.render("admin/library", { locals });
    }
  }
);



//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------


/*
  ADMIN 
  MEDIA
*/

router.get("/admin/media", (req, res) => {
  locals = {
    title: "admin/media",
  };
  res.render("admin/media", { locals });
});



router.post("/admin/library/addMediaInformation", upload.single("news-events-image-upload"), async (req, res) => {

  locals = {
    title: "admin/media",
  };
  
  try {
    if (req.body['latest-news-upload'])
    {
      await LatestNews.deleteMany({});
      const latest_news = new LatestNews({
        news: req.body['latest-news-upload']
      });
      await LatestNews.create(latest_news);
    }

    if (req.body['quranic-verse-num-upload'] && req.body['quranic-verse-upload']) {
      
      await QuranicVerse.deleteMany({ verseNum: req.body['quranic-verse-num-upload'] });
        
      const quranic_verse = new QuranicVerse({
        verseNum: req.body['quranic-verse-num-upload'],
        verse: req.body['quranic-verse-upload'],
      });
      await QuranicVerse.create(quranic_verse);
    }

    const message = await Message.findOne();
    if (message)
    {
      if (req.body['message1-upload'])
      {
        message.message1 = req.body['message1-upload'];
      }
      if (req.body['message1-author-upload']) {
        message.message1Author = req.body['message1-author-upload'];
      }
      if (req.body['message2-upload']) {
        message.message2 = req.body['message2-upload'];
      }
      if (req.body['message2-author-upload']) {
        message.message2Author = req.body['message2-author-upload'];
      }
    }
    else if (
      req.body["message1-upload"] &&
      req.body["message1-author-upload"] &&
      req.body["message2-upload"] &&
      req.body['message2-author-upload']) {
      
      const newMessage = new Message({
        message1: req.body['message1-upload'],
        message1Author: req.body['message1-author-upload'],
        message2: req.body['message2-upload'],
        message2Author: req.body['message2-author-upload'],
      });
      await Message.create(newMessage);
    }

    if (req.body['news-events-id-upload'] && req.body['news-events-description-upload'])
    {
      const newNewsEvents = new NewsEvents({
        id: req.body['news-events-id-upload'].toUpperCase(),
        description: req.body['news-events-description-upload'],
      });
      await NewsEvents.create(newNewsEvents);
    }

    if (req.body['news-events-id-upload'] && req.file) {
      const newNewsEventsPhoto = new NewsEventsPhoto({
        id: req.body['news-events-id-upload'].toUpperCase(),
        photoUrl: req.file.path,
        photoId: req.file.filename,
      });
      await NewsEventsPhoto.create(newNewsEventsPhoto);
    }

    if (req.body['notice-id-upload'] && req.body['notice-description-upload']) {
      const newNotice = new Notice({
        id: req.body['notice-id-upload'].toUpperCase(),
        notice: req.body['notice-description-upload'],
      });
      await Notice.create(newNotice);
    }
    





    res.render('admin/media', { locals });
  } catch (err)
  {
    console.log(err);
    res.render("admin/media", { locals });
  }

});















module.exports = router;
