/* Part 2: Adding Additional Routes:
POST /comments
GET /comments/:id
PATCH /comments/:id
DELETE /comments/:id
GET /comments?userId=<VALUE> */

import express from 'express'
const router = express.Router();

import comments from '../data/comments.js';
import error from '../utilities/error.js';

router
    .route("/")

// Part 2: Adding Additional Routes - GET /comments

    .get((req, res, next) => {

        const links = [

            {
            href: "comments/:id",
            rel: ":id",
            type: "GET",
            },
            
        ];

        const comment = comments.filter((comment) => comment.userId == req.query.userId);

        if (req.query.userId) {

        res.json({ comment });
        
        } else {

        res.json({ comments, links });

        } 

    }
)

// Part 2: Adding Additional Routes - POST /comments

    .post((req, res, next) => {

        if (req.body.userId && req.body.postId && req.body.body) {

      const comment = {
        // id: comments[comments.length - 1].id + 1,
        // Array is currently empty so above syntax will not work
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,

      };

      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(400, "Insufficient Data"));

    }
)

router
    .route("/:id")

// Part 2: Adding Additional Routes - GET /comments/:id
    
    .get((req, res, next) => {

        const comment = comments.find((postComment) => postComment.id == req.params.id);

        const links = [
        {
            href: `/${req.params.id}`,
            rel: "",
            type: "PATCH",
        },
        {
            href: `/${req.params.id}`,
            rel: "",
            type: "DELETE",
        },
        ];

        if (comment) res.json({ comment, links });
        else next();       

        }
)

// Part 2: Adding Additional Routes - PATCH /comments/:id

    .patch((req, res, next) => {

        const comment = comments.find((postComment, i) => {

            if (postComment.id == req.params.id) {

                comments[i].body = req.body.body;

                return true;
            }
        });

        if (comment) res.json(comment);
        else next();
    }
)

// Part 2: Adding Additional Routes - DELETE /comments/:id

    .delete((req, res, next) => {

        const comment = comments.find((postComment, i) => {
        
            if (postComment.id == req.params.id) {

                comments.splice(i, 1);

                return true;
            }
        });

        if (comment) res.json(comment);
        else next();

    }
)


export default router