const blogModel = require('../models/blogModel.js');
const authorModel = require('../models/authorModel.js');


const { isValidString, isValidRequestBody, isValidObjectId, isVaildEmail } = require('../validations/validator.js');

//****************** API for create blog ******************
const createBlog = async function (req, res) {

    try {

        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: 'Empty request body. Please provide details' });

        const { title, body, authorId, category } = req.body;

        if (!isValidString(title)) return res.status(400).send({ status: false, message: 'Please provide title' });

        if (!isValidString(body)) return res.status(400).send({ status: false, message: 'Please provide  body' });

        if (!isValidString(category)) return res.status(400).send({ status: false, message: 'Please provide category' });

        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, message: 'Please provide valid authorId' });

        const checkAuthor = await authorModel.findOne({ _id: authorId });

        if (!checkAuthor) return res.status(404).send({ status: false, message: 'Author not found' });

        if (req.body.isPublished) requestBody['publishedAt'] = new Date();

        if (req.body.isDeleted) requestBody['deletedAt'] = new Date();

        const blogDetail = await blogModel.create(requestBody);

        res.status(201).send({ status: false, message: 'Blog created successfully', data: blogDetail });


    } catch (error) {

        res.status(500).send({ status: false, message: error.message });
    }

};


//****************** API for list of all Blogs with filter******************
const blogList = async function (req, res) {

    try {

        let filter = {
            isDeleted: false,
            isPublished: true
        }

        const { authorId, category, tags, subcategory } = req.query;

        if (authorId) {
            if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, message: 'Please provide valid authorId' });
            filter['authorId'] = authorId;
        }

        if (tags) {
            if (!isValidString(tags)) return res.status(400).send({ status: false, message: 'Please provide valid tags string' });
            filter['tags'] = tags;
        }

        if (category) {
            if (!isValidString(category)) return res.status(400).send({ status: false, message: 'Please provide valid category string' });
            filter['category'] = category;
        }

        if (subcategory) {
            if (!isValidString(subcategory)) return res.status(400).send({ status: false, message: 'Please provide valid subcategory string' });
            filter['subcategory'] = subcategory;
        }

        const list = await blogModel.find(filter);

        if (list.length === 0) return res.status(404).send({ status: false, message: 'No blog found' });

        res.status(200).send({ status: true, message: 'Blog List', data: list });

    } catch (error) {

        res.status(500).send({ status: false, message: error.message });
    }

};


//****************** API for update Blog ******************
const updateBlog = async function (req, res) {

    try {

        const blogId = req.params.blogId;

        const tokenId = req.authorId

        const blogDetail = await blogModel.findOne({ _id: blogId, isDeleted: false });

        if (!blogDetail) return res.status(404).send({ status: false, mesaage: 'No Blog Found' });

        if (!(tokenId == blogDetail.authorId)) return res.status(401).send({ status: false, message: 'Unauthorised access' });

        const { title, body, tags, category, subcategory, isPublished } = req.body;

        let publishedAt = null

        if (isPublished) publishedAt = new Date();

        let updateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { title: title, body: body, category: category, publishedAt: publishedAt, isPublished: isPublished }, $push: { tags: tags, subcategory: subcategory } }, { new: true });

        res.status(200).send({ status: true, message: 'Updated successfully', data: updateBlog });


    } catch (error) {

        res.status(500).send({ status: false, message: error.message });
    }

};


//****************** API for Deletion of Blogs by Id ******************

const deleteBlogByID = async function (req, res) {

    try {
        
        const blogId = req.params.blogId
        
        const authorIdFromToken = req.authorId

        if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` });


        if (!isValidObjectId(authorIdFromToken)) return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` });

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null });

        if (!blog) return res.status(404).send({ status: false, message: `Blog not found` });
            
        
        if (blog.authorId != authorIdFromToken)  return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            
        await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } });
        
        res.status(200).send({ status: true, message: `Blog deleted successfully` });
   
    } catch (error) {

        res.status(500).send({ status: false, message: error.message });

    }
};


//****************** API for Deletion of Blogs by filter ******************
const deleteBlogByParams = async function (req, res) {

    try {

        const filterQuery = { isDeleted: false, deletedAt: null }
        
        const queryParams = req.query
        
        const authorIdFromToken = req.authorId

        if (!isValidObjectId(authorIdFromToken)) return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` });

        if (!isValidRequestBody(queryParams)) return res.status(400).send({ status: false, message: `No query params received. Aborting delete operation` });

        const { authorId, category, tags, subcategory, isPublished } = queryParams

        if (isValidString(authorId) && isValidObjectId(authorId)) {
            filterQuery['authorId'] = authorId
        }

        if (isValidString(category)) {
            filterQuery['category'] = category.trim()
        }

        if (isValidString(isPublished)) {
            filterQuery['isPublished'] = isPublished
        }

        if (isValidString(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            filterQuery['tags'] = { $all: tagsArr }
        }

        if (isValidString(subcategory)) {
            const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
            filterQuery['subcategory'] = { $all: subcatArr }
        }

        const blogs = await blogModel.find(filterQuery);

        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(404).send({ status: false, message: 'No matching blogs found' })
            return
        }

        const idsOfBlogsToDelete = blogs.map(blog => {
            if (blog.authorId.toString() === authorIdFromToken) return blog._id
        })

        if (idsOfBlogsToDelete.length === 0) {
            res.status(404).send({ status: false, message: 'No blogs found' })
            return
        }

        await blogModel.updateMany({ _id: { $in: idsOfBlogsToDelete } }, { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(200).send({ status: true, message: 'Blog(s) deleted successfully' });

    } catch (error) {

        res.status(500).send({ status: false, message: error.message });

    }
};


//****************** API for list of all created Blogs ******************
const getCreatedBlogList = async function (req, res) {
    try {
        const list = await blogModel.find();

        res.status(200).send({ status: true, message: "Created Blog list", data: list });

    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }

};

module.exports = {createBlog,blogList,updateBlog,deleteBlogByID,deleteBlogByParams,getCreatedBlogList}