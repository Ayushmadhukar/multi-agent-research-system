from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
from dotenv import load_dotenv
load_dotenv()

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query: str) -> str:
    """
    Perform a web search using Tavily API and return the  Titles,URLs and Snippets.
    """ 
    results = tavily_client.search(query=query, num_results=5)

    out = []
                                                      
    for r in results["results"]:
        out.append(f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\n")


    return "\n".join(out)

@tool
def scrape_website(url: str) -> str:
    """
    Scrape the content of a website and return the  clean text content from a given URL for deeper reading.
    """
    try:
        response = requests.get(url, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style','nav','header','footer']):
            tag.decompose()
        return soup.get_text(separator=" ", strip=True)[:3000]
    except Exception as e:
        return f"Error occurred while scraping the website: {str(e)}"                    