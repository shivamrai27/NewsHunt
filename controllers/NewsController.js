import vine, { errors } from '@vinejs/vine';
import prisma from "../DB/db.config.js"
import { newsSchema } from '../Validations/NewsValidation.js';
import { messages } from '@vinejs/vine/defaults';
import { generateRandomNum, imageValidator, removeImage, uploadImage } from '../utils/helper.js';
import newsApiTransform from '../transform/newsApiTransform.js';

class NewsController {
    static async index(req, res) {
        //* Pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 3

        if (page <= 0) {
            page = 0;
        }
        if (limit <= 0 || limit > 10) {
            limit = 10;
        }
        const skip = (page - 1) * limit
        const news = await prisma.news.findMany({
            take: limit,
            skip: skip,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    },
                },

            },
        });
        const newsTransform = news?.map((item) => newsApiTransform.transform(item))

        const totalNews = await prisma.news.count();
        const totalPages = Math.ceil(totalNews / limit)
        return res.json({
            status: 200,
            news: newsTransform,
            metadata: {
                totalPages,
                currentPage: page,
                currentLimit: limit,
            }
        })
    }

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    errors: { image: "Image field is requird." },
                });
            }

            const image = req.files?.image;
            // * Image custom validator
            const message = imageValidator(image?.size, image?.mimetype);
            if (message !== null) {
                return res.status(400).json({
                    errors: {
                        image: message,
                    },
                });
            }

            // * Image upload 
            const imageName = uploadImage(image);
            payload.image = imageName;
            payload.user_id = user.id;

            const news = await prisma.news.create({
                data: payload
            });

            // * remove cache
            redisCache.del("/api/news", (err) => {
                if (err) throw err;
            });

            return res.json({ status: 200, message: "News created sucessfully", news });
        }
        catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    messages: "something went wrong"
                });
            }
        }

    }

    static async show(req, res) {
        try {
            const { id } = req.params;
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });

            const transformNews = news ? newsApiTransform.transform(news) : null
            return res.json({ status: 200, news: transformNews })
        } catch (error) {
            res.json({ staus: 500, message: "something went wrong" })
        }

    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const body = req.body;
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                },
            })
            if (user.id != news.user_id) {
                return res.status(400).json({ message: "UnAuthorized " })
            }
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(body)
            const image = req?.file?.image;

            if (image) {
                const message = imageValidator(image?.size, image?.mimetype)
                if (message != null) {
                    return res.status(400).json({
                        errors: {
                            image: message,
                        }
                    })
                }
                // * Upload new image
                const imageName = uploadImage(image);
                payload.image = imageName
                //* Delete old image
                removeImage(news.image)
            }
            await prisma.news.update({

                data: payload,
                where: {
                    id: Number(id),
                },
            });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    messages: "something went wrong"
                });
            }
        }
        return res.status(200).json({ message: "news updated successfully" });
    }

    static async destroy(req, res) {
        try {
            const { id } = req.params
            const user = req.user
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id),
                }
            })
            if (user.id != news?.user_id) {
                return res.status(401).json({ message: "UnAuthorized" },)
            }
            // * delete image from filesystem
            removeImage(news.image);
            await prisma.news.delete({
                where: {
                    id: Number(id)
                },
            });
            return res.json({ message: "news deleted successfully" })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    messages: "something went wrong"
                });
            }
        }
    }
}

export default NewsController;