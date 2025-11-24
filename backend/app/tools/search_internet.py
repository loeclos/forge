from agno.tools import tool
from tavily import TavilyClient
from core.config import settings


client = TavilyClient(settings.TAVILY_API_KEY)


@tool(requires_confirmation=True)
def search_internet(query):
    '''
    A function that searches the internet and returns mulitple urls.

    Params: 
        query - string
    
    Returns:
        A JSON object. An example return:
        ```json
            {
                "query": YOUR QUERY
                "results": [
                    {
                        "url": "https://example.com",
                        "title": "Something something something",
                        "content": "We talk about something here..." 
                        "score": 0.79,
                        "raw_content": "The website scraped" | null
                    },
                    ...
                ]
            }
        ```

        Explanation of fields inside the `results`:
            `url`: The url of the website that was returned in the search
            `title`: The title of the website.
            `content`: A quick overview of the content inside the website.
            `score`: The probability that the website is relevant to the query.
            `raw_content`: The website scraped more thoroughly. This is usually more detailed than the `content` field. Use this field to get detailed and relevant answers.

        You will go over the `results` array and look through all of the `title` and `content`. You will then choose 2-3 websites from the results and dive more deeply into the `raw_content`, if it exsists.
    '''
    response = client.search(query=query, include_raw_content="text")

    return response