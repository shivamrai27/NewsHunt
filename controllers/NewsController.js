import vine, { errors } from '@vinejs/vine';
import { newsSchema } from '../Validations/NewsValidation.js';
import { messages } from '@vinejs/vine/defaults';
class NewsController {
    static async index(req, res) { }

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(body)
        } catch (error) {

            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.message);
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    message: "something went wrong"
                })
            }
        }

    }

    static async show(req, res) { }

    static async update(req, res) { }

    static async destroy(req, res) { }
}

export default NewsController;