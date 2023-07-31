import express from 'express';
import { nanoid } from 'nanoid'
let router = express.Router()


let posts = [{
    id: nanoid(),
    title: "",
    text: ""
}]

router.post('/post', (req, res, next) => {

    if (!req.body.title ||
        !req.body.text
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }

    posts.unshift({
        id: nanoid(),
        title: req.body.title,
        text: req.body.text,
    })

    res.send('post created');
})


router.get('/post/:postId', (req, res, next) => {
   
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === Number(req.params.postId)) {
            res.send(posts[i]);
            return;
        }
    }
    res.send('post not found with id ' + req.params.postId);
})


router.get('/posts', (req, res, next) => {
    res.send(posts);
})


router.delete('/post/:postId', (req, res, next) => {
   

    const postId = req.params.postId;

    
    const postIndex = posts.findIndex(post => post.id === postId);


    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        res.send('Post deleted');
    } else {
        res.status(404).send('Post not found');
    }
});




router.put('/post/:postId', (req, res, next) => {

    const postId = req.params.postId;

   
    const postIndex = posts.findIndex(post => post.id === postId);

    
    if (postIndex !== -1) {
      
        if (!req.body.title || !req.body.text) {
            res.status(403).send('Title and text are required for updating a post');
            return;
        }

       
        posts[postIndex].title = req.body.title;
        posts[postIndex].text = req.body.text;

        res.send('Post updated');
    } else {
        res.status(404).send('Post not found');
    }
});


export default router