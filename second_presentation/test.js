import { createClient } from "pexels";

const client = createClient("YOUR_API_KEY");
const query = "Nature";

client.photos.search({ query, per_page: 1 }).then((photos) => {
  console.log(photos);
});
