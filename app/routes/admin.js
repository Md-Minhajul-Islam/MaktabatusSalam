const express = require("express");
const router = express.Router();
const upload = require("../db/config/multer");
const Book = require("../models/book");
const cloudinary = require("../db/config/cloudinary");




// LIBRARY
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

router.get("/admin/library", (req, res) => {
  locals = {
    title: "admin/library",
    success: 0,
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



















module.exports = router;
