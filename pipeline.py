from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain

def run_research_pipeline(topic:str) -> dict:

    state ={}

    #1st agent: search agent
    search_agent = build_search_agent()
    search_results = search_agent.invoke({
        "messages": [
            {"role": "system", "content": "You are a research assistant."},
            {"role": "user", "content": f"find recent, reliable and detailed about: {topic}"}
        ]
    })

    state['search_results'] = search_results['messages'][-1].content

    print("Search Results:", state['search_results'])

    #2nd agent: reader agent
    reader_agent = build_reader_agent() 
    reader_results = reader_agent.invoke({
        "messages": [
            {"role": "system", "content": "You are a research reader."},
            {"role": "user", "content":
             f'based on the following search results about {topic}'
             f'pick the most relevant and reliable URL and scrape it for deeper content and insights.'
             f'search results: {state["search_results"][:1000]}'}
        ]
    })

    state['scraped_content'] = reader_results['messages'][-1].content

    print("Scraped Content:", state['scraped_content'])

    #3rd agent: writer agent

    reserch_combined = f"Search Results: \n {state['search_results']}\n\nScraped Content: \n{state['scraped_content']}"

    writer_results = writer_chain.invoke({
               'topic': topic,
               'research': reserch_combined
            })

    state['writer_results'] = writer_results

    print("Writer Results:", state['writer_results'])   


    #4th agent: critic agent
    critic_results = critic_chain.invoke({
        'report': state['writer_results']
    })

    state['critic_results'] = critic_results

    print("Critic Report:", state['critic_results'])

    return state

if __name__ == "__main__":
    topic = input("Enter a research topic: ")
    run_research_pipeline(topic)
   



