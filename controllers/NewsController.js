import vine, { errors } from '@vinejs/vine';
import prisma from "../DB/db.config.js"
import { newsSchema } from '../Validations/NewsValidation.js';
import { messages } from '@vinejs/vine/defaults';
import { generateRandomNum, imageValidator } from '../utils/helper.js';
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
            const imgExt = image?.name.split(".");
            const imageName = generateRandomNum() + "." + imgExt[1];

            // * where(path) you want to save the image after renaming it
            const uploadPath = process.cwd() + "/public/images/" + imageName;

            // * moving the profile pic to uploadPath
            image.mv(uploadPath, (err) => {
                if (err) throw err;
            });
            payload.image = imageName;
            payload.user_id = user.id;

            const news = await prisma.news.create({
                data: payload
            })
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
        })
    }

    static async update(req, res) { }

    static async destroy(req, res) { }
}

export default NewsController;