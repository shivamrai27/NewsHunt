import vine, { errors } from '@vinejs/vine';
import prisma from "../DB/db.config.js"
import { newsSchema } from '../Validations/NewsValidation.js';
import { messages } from '@vinejs/vine/defaults';
import { generateRandomNum, imageValidator } from '../utils/helper.js';
class NewsController {
    static async index(req, res) { }

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

    static async show(req, res) { }

    static async update(req, res) { }

    static async destroy(req, res) { }
}

export default NewsController;