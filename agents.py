from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, scrape_website
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatMistralAI(
    model_name="mistral-small-latest",
    mistral_api_key=os.getenv("MISTRAL_API_KEY")
)

# Configure Groq model only if explicitly enabled and credentials are present.
groq_model_name = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
use_groq = os.getenv("USE_GROQ", "false").lower() in ("1", "true", "yes") and bool(os.getenv("GROQ_API_KEY"))
models = None
if use_groq:
    try:
        models = ChatGroq(
            model=groq_model_name,
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
    except Exception:
        models = None

def build_search_agent():
    # Prefer Groq if available; otherwise fall back to the Mistral LLM.
    return create_agent(
        model = models if models is not None else llm,
        tools = [web_search]
    )

def build_reader_agent():
    return create_agent(
        model = llm,
        tools = [scrape_website]
    )   

writer_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research writer. Write clear, structured and insightful reports."),
    ("human", """Write a detailed research report on the topic below.

Topic: {topic}

Research Gathered:
{research}

Structure the report as:
- Introduction
- Key Findings (minimum 3 well-explained points)
- Conclusion
- Sources (list all URLs found in the research)

Be detailed, factual and professional."""),
])  

writer_chain = writer_prompt | llm | StrOutputParser()

critic_prompt = ChatPromptTemplate.from_messages([
     ("system", "You are a sharp and constructive research critic. Be honest and specific."),
    ("human", """Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
..."""),
])

critic_chain = critic_prompt | (models if models is not None else llm) | StrOutputParser()

 