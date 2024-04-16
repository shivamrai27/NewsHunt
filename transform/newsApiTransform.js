import { getImageUrl } from "../utils/helper.js";

class newsApiTransform {
    static transform(news) {
        return {
            id: news.id,
            heading: news.title,
            news: news.content,
            image: getImageUrl(news.image),
            created_at: news.created_at,
            reporter: {
                id: news?.user.id,
                name: news?.user.name,
                profile: news?.user?.profile != null ? getImageUrl(news?.user?.profile) : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw1ADeRRBO1HcskbBF_0qz85&ust=1713309244908000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNim7LmsxYUDFQAAAAAdAAAAABAE",

            }

        }
    }
}
export default newsApiTransform;