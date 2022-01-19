const express = require('express')

const router = express.Router()

const authorController = require('../controllers/authorController.js');

const blogController = require('../controllers/blogController.js');

const { authorAuth } = require('../middlewares/authorAuth.js')

//****************** Author ******************
router.post('/authors' , authorController.registerAuthor);

router.post('/login' , authorController.login);

router.get('/authors' , authorController.getRegisterAuthorList);

//****************** Blog ******************
router.post('/blogs', authorAuth , blogController.createBlog);

router.get('/blogs', authorAuth , blogController.blogList);

router.put('/blogs/:blogId', authorAuth , blogController.updateBlog);

router.delete('/blogs/:blogId', authorAuth , blogController.deleteBlogByID);

router.delete('/blogs', authorAuth , blogController.deleteBlogByParams);

router.get('/blogsList', blogController.getCreatedBlogList);




module.exports = router