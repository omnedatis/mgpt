# -*- coding: utf-8 -*-
"""
Created on Tuesday 05 16 15:51:39 2023

@author: Jeff
"""
import logging # type: ignore
import pickle # type: ignore
from threading import Lock # type: ignore
import os
from llama_index import (download_loader, GPTVectorStoreIndex, LLMPredictor,
                         StorageContext, load_index_from_storage)
from flask import Flask, request
from waitress import serve

app = Flask(__name__)

__KEY__ =  "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"

os.environ['OPENAI_API_KEY'] = __KEY__

SimpleDirectoryReader = download_loader("SimpleDirectoryReader")

llm_predictor = LLMPredictor()
loader = SimpleDirectoryReader('./data', recursive=True, exclude_hidden=True)
documents = loader.load_data()

# compare data here
if os.path.isdir('./storage'):
    storage_context = StorageContext.from_defaults(persist_dir='./storage')
    indices = load_index_from_storage(storage_context=storage_context)
else:
    indices = GPTVectorStoreIndex.from_documents(documents, llm_predictor=llm_predictor)

indices.storage_context.persist('./storage')
engine = indices.as_query_engine()
chat_lock = Lock()
print('ready')
@app.post('/chat')
def chat():
    print(request.json)
    chat_lock.acquire()
    message = request.json.get('message')
    if not message:
        chat_lock.release()
        print('here')
        return {
            'message':'',
            'token_used':llm_predictor.last_token_usage  
        }
    resp = engine.query(f'{message}，請以中文回答')
    print(resp)
    chat_lock.release()
    return {
        'message':resp.response,
        'token_used':llm_predictor.last_token_usage
    }

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    serve(app, port=8080)
