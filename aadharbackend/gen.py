from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import requests
import json
import logging
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# API Key and Secret
API_KEY = os.getenv('API_KEY')
API_SECRET = os.getenv('API_SECRET')

# Variable to store the access token
access_token = None

def generate_access_token():
    global access_token
    url = 'https://api.sandbox.co.in/authenticate'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-api-secret': API_SECRET,
        'x-api-version': '1.0'
    }

    try:
        print('Generating access token...')
        response = requests.post(url, headers=headers)
        response_data = response.json() # Log the response for debugging
        if response.status_code == 200 and 'access_token' in response_data:
            access_token = response_data['access_token']
            print ('Access token generated successfully:', access_token)
        else:
            print('Failed to generate access token:', response_data.get('message', 'Unknown error'))
            raise Exception(response_data.get('message', 'Failed to generate access token'))
    except Exception as e:
        print('Error generating access token:', str(e))
        raise e

generate_access_token()