const { validationResult } = require("express-validator/check");
const fs = require("fs");
const path = require("path");
//const post = require("../models/post");

const User =require('../models/user');
const Post = require("../models/post"); //all the post access through the 'Post'


exports.getPosts = (req, res, next) => {
  const currntPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currntPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({
          message: "Fetch posts successfully.",
          posts: posts,
          totalItems: totalItems,
        });
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // res.status(200).json({
  //   post: [
  //     {
  //       _id: "1",
  //       title: "first",
  //       content: "my first rest api data",
  //       imageUrl: "images/looms1.jpg",
  //       creator: {
  //         name: "brijesh",
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422; //our custom property and name should be whatever we want
    throw error;
  }
  // if (!req.file) {
  //   const error = new Error('No image provided.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  // const imageUrl = req.file.path;

  const title = req.body.title;
  const content = req.body.content;
  //create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/looms1.jpg",
    creator: 123 // req.userId
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error; //if throw error then it go to catch block and pass the error in 'err'.....
      }
      res.status(200).json({ message: "post fetched.", post: post });
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422; //our custom property and name should be whatever we want
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file Picked.");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error; //if throw error then it go to catch block and pass the error in 'err'.....
      }
      if(post.creator.toString() !== req.userId){
        const error = new Error('Not Authorized');
        error.statusCode =403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post Updated!", post: result });
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error; //if throw error then it go to catch block and pass the error in 'err'.....
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted POst!." });
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
