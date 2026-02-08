export async function getMealImage(query: string) {
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query + " food"
        )}&per_page=1`,
        {
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
        }
    );

    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
}
