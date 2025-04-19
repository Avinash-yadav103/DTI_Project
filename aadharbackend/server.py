from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests
import json
import logging
import hashlib
import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Validate required environment variables
required_env_vars = ['FLASK_SECRET_KEY', 'API_KEY', 'API_SECRET', 'ACCESS_TOKEN']
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    logging.warning(f"Missing required environment variables: {', '.join(missing_vars)}")

# Initialize Firebase Admin SDK
firebase_credentials_path = './project-charak-firebase-adminsdk-fbsvc-d9521be673.json'
if not os.path.exists(firebase_credentials_path):
    logging.error(f"Firebase credentials file not found: {firebase_credentials_path}")
    raise FileNotFoundError(f"Firebase credentials file not found: {firebase_credentials_path}")

try:
    cred = credentials.Certificate(firebase_credentials_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logging.info("Firebase initialized successfully")
except Exception as e:
    logging.error(f"Error initializing Firebase: {str(e)}")
    raise

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))
CORS(app)  # Enable CORS for all routes

# API Key and Secret from environment variables
API_KEY = os.getenv('API_KEY')
API_SECRET = os.getenv('API_SECRET')

# Access token from environment variables
access_token = os.getenv('ACCESS_TOKEN')

# Route to send OTP
@app.route('/send-otp', methods=['POST'])
def send_otp():
    # Store in session instead of global variables
    data = request.json
    aadhar_number = data.get('aadharNumberMain')
    password = data.get('password')

    if not aadhar_number or len(aadhar_number) != 12 or not aadhar_number.isdigit():
        return jsonify({'success': False, 'message': 'Invalid Aadhar number'}), 400

    # Store in session
    session['aadhar_number'] = aadhar_number
    session['password'] = password

    url = 'https://api.sandbox.co.in/kyc/aadhaar/okyc/otp'
    headers = {
        'Authorization': access_token,
        'x-api-key': API_KEY,
        'x-api-version': '2.0',
        'Content-type': 'application/json'
    }
    payload = json.dumps({
        '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
        'aadhaar_number': aadhar_number,
        'consent': 'y',
        'reason': 'For KYC'
    })

    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        response_data = response.json()
        print('Aadhar API Response:', response_data)  # Log the response for debugging

        # Extract reference_id from the nested 'data' key
        reference_id = response_data.get('data', {}).get('reference_id')

        if response.status_code == 200 and reference_id:
            print('OTP sent successfully:', reference_id)
            return jsonify({'success': True, 'reference_id': reference_id})
        else:
            return jsonify({'success': False, 'message': response_data.get('message', 'Failed to send OTP')}), response.status_code
    except Exception as e:
        print('Error in /send-otp:', str(e))
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    otp = data.get('otp')
    reference_id = data.get('reference_id')

    # Check if we have the required session data
    if 'aadhar_number' not in session or 'password' not in session:
        return jsonify({'success': False, 'message': 'Session expired, please restart the verification process'}), 400

    print('Incoming Request Body:', otp, reference_id)

    # Input validation
    if not otp or len(otp) != 6 or not otp.isdigit():
        return jsonify({'success': False, 'message': 'Invalid OTP'}), 400
    if not reference_id:
        return jsonify({'success': False, 'message': 'Missing reference ID'}), 400

    url = 'https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify'
    headers = {
        'Authorization': access_token,
        'x-api-key': API_KEY,
        'x-api-version': '2.0',
        'Content-Type': 'application/json'
    }
    
    # Modified payload structure to match API requirements
    payload = {
        "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
        "reference_id": str(reference_id),
        "otp": str(otp)
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        print('Aadhar API Response:', response_data)
        
        # Store response in session
        if response.status_code == 200:
            session['otp_verification_data'] = response_data
            return jsonify({
                'success': True, 
                'message': 'OTP verified successfully', 
                'data': response_data.get('data', {})
            })
        else:
            return jsonify({
                'success': False, 
                'message': response_data.get('message', 'Failed to verify OTP'),
                'data': response_data
            }), response.status_code

    except Exception as e:
        print('Error in /verify-otp:', str(e))
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    

@app.route('/register_user', methods=['POST'])
def register_user():
    # Check if required session data exists
    if 'aadhar_number' not in session or 'password' not in session:
        return jsonify({
            'success': False,
            'message': 'Missing authentication data. Please complete OTP verification first.'
        }), 400
        
    data = request.get_json()
    
    if 'otp_verification_data' not in session:
        return jsonify({
            'success': False,
            'message': 'Missing OTP verification data. Please complete verification first.'
        }), 400

    # Get data from session
    basic_details = session.get('otp_verification_data')
    aadhar_number = session.get('aadhar_number')
    password = session.get('password')

    print('Incoming Request Body:', data)

    # Hash the user ID for security
    user_id = hashlib.sha256(f"{aadhar_number}{password}".encode()).hexdigest()[:10]
    # Hash the password for storage
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    allergies = data.get('allergies', [])
    blood_group = data.get('blood_group', "")

    user_data = {
        'user_id': user_id,
        'aadhar_number': aadhar_number,
        'password': hashed_password,  # Store hashed password
        'basic_details': basic_details,
        'medical_details': {'blood_group': blood_group, 'allergies': allergies},
        'created_at': firestore.SERVER_TIMESTAMP
    }

    try:
        doc_ref = db.collection('patients').document(user_id)
        doc = doc_ref.get()
        
        if doc.exists:
            return jsonify({
                'success': False,
                'message': 'User already exists'
            }), 400
            
        doc_ref.set(user_data)
        
        # Clear sensitive session data after successful registration
        session.pop('aadhar_number', None)
        session.pop('password', None)
        session.pop('otp_verification_data', None)
        
        return jsonify({
            'success': True, 
            'message': 'User registered successfully',
            'user_id': user_id
        }), 201
    
    except Exception as e:
        print('Error saving user to Firestore:', str(e))
        return jsonify({
            'success': False, 
            'message': 'Failed to register user'
        }), 500

# Updated login function with alternate route
@app.route('/login', methods=['POST'])
@app.route('/auth/login', methods=['POST'])  # Add alternative route path
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'Invalid request format'
            }), 400
            
        userID = data.get('userID')
        password = data.get('password')
        role = data.get('role')

        if not userID or not password:
            return jsonify({
                'success': False,
                'message': 'UserID and password are required'
            }), 400
            
        valid_roles = ['patients', 'doctors', 'government']
        if role not in valid_roles:
            return jsonify({
                'success': False,
                'message': f'Invalid role. Must be one of {", ".join(valid_roles)}'
            }), 400
        
        doc_ref = db.collection(role).document(str(userID))
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials or user does not exist'
            }), 401

        user_data = doc.to_dict()
        stored_password = user_data.get('password', '')
        
        # Compare with hashed password
        hashed_input_password = hashlib.sha256(password.encode()).hexdigest()
        
        if stored_password != password and stored_password != hashed_input_password:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
            
        # Remove password before sending response
        if 'password' in user_data:
            user_data.pop('password')
            
        # Store user info in session
        session['user_id'] = userID
        session['role'] = role
            
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': user_data
        }), 200

    except Exception as e:
        print(f'Error during login: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

# Add logout endpoint
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=4505, debug=True)
    except Exception as e:
        print('Failed to start the server:', str(e))