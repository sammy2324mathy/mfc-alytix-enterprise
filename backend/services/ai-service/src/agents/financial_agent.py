import json
from typing import Tuple

from src.llm.client import LLMClient
from src.memory.redis_store import RedisMemoryStore
from ..tools.finance_tools import finance_tools_schema, finance_functions

class FinancialAgent:
    def __init__(self):
        self.llm = LLMClient()
        self.memory = RedisMemoryStore()
        
    async def process_query(self, session_id: str, query: str, system_prompt: str = "You are a helpful financial AI.") -> str:
        # Load memory
        history = await self.memory.get_chat_history(session_id)
        
        if not history:
            history.append({
                "role": "system",
                "content": system_prompt
            })
            
        history.append({"role": "user", "content": query})
        
        # Save user query to memory
        await self.memory.append_message(session_id, "user", query)
        
        # Call LLM
        response = await self.llm.chat_completion(messages=history, tools=finance_tools_schema)
        message = response["choices"][0]["message"]
        
        # Handle Tool Calls
        if message.get("tool_calls"):
            tool_call = message["tool_calls"][0]
            func_name = tool_call["function"]["name"]
            func_args = json.loads(tool_call["function"]["arguments"])
            
            if func_name in finance_functions:
                result = finance_functions[func_name](**func_args)
                history.append(message) # Append assistant's tool call request
                
                history.append({
                    "role": "tool",
                    "tool_call_id": tool_call["id"],
                    "name": func_name,
                    "content": str(result)
                })
                
                # Make second LLM call with tool execution result
                second_response = await self.llm.chat_completion(messages=history)
                final_content = second_response["choices"][0]["message"]["content"]
            else:
                final_content = "Sorry, I tried to use an unrecognized tool."
        else:
            final_content = message.get("content", "I am unable to provide a response.")
            
        # Save assistant response to memory
        await self.memory.append_message(session_id, "assistant", final_content)
        
        return final_content
