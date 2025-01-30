export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed!",
        });
    }

    const { text, target } = req.body;

    if (!text || !target) {
        return res.status(400).json({ error: "Missing text or language!" });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                target,
                format: 'text',
            }),
        });

        if(!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({error: errorText});
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch(error) {
        console.error('Error in API call: ', error);

        res.status(500).json({error: 'Internal Server Error.'});
    }
}
