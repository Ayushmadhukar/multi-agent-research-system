from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, scrape_website
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_llm():
    """Initializes the best available LLM: Groq if configured, otherwise Mistral."""
    groq_api_key = os.getenv("GROQ_API_KEY")
    use_groq = os.getenv("USE_GROQ", "true").lower() in ("1", "true", "yes")

    if use_groq and groq_api_key:
        groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
        try:
            return ChatGroq(
                model=groq_model,
                temperature=0.1,
                groq_api_key=groq_api_key
            )
        except Exception as e:
            print(f"[agents] Warning: Failed to initialize Groq with {groq_model}: {e}")

    # Fallback to Mistral
    mistral_api_key = os.getenv("MISTRAL_API_KEY")
    if mistral_api_key:
        try:
            return ChatMistralAI(
                model_name=os.getenv("MISTRAL_MODEL", "mistral-small-latest"),
                mistral_api_key=mistral_api_key
            )
        except Exception as e:
            print(f"[agents] Warning: Failed to initialize Mistral: {e}")

    # Fallback to Groq with lightweight model
    if groq_api_key:
        return ChatGroq(
            model="openai/gpt-oss-20b",
            temperature=0.1,
            groq_api_key=groq_api_key
        )
    raise RuntimeError("No valid LLM configuration found. Please check GROQ_API_KEY or MISTRAL_API_KEY in .env.")

llm = initialize_llm()

def build_search_agent():
    return create_react_agent(
        model = llm,
        tools = [web_search]
    )

def build_reader_agent():
    return create_react_agent(
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

critic_chain = critic_prompt | llm | StrOutputParser()