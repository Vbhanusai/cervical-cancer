from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import io
import os
import random
from werkzeug.utils import secure_filename
import joblib
import cv2
from transformers import ViTFeatureExtractor, TFViTModel
from tensorflow.keras.preprocessing.image import img_to_array


app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg','bmp'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Data Loading Function
def load_dataset(img_path):

    """
    Traverses the dataset directory structure and loads only .bmp images.
    Expected structure:
      dataset_path/
         Dyskeratotic/Dyskeratotic/CROPPED/*.bmp
         Koilocytotic/Koilocytotic/CROPPED/*.bmp
         Metaplastic/Metaplastic/CROPPED/*.bmp
         Parabasal/Parabasal/CROPPED/*.bmp
         Superficial-Intermediate/Superficial-Intermediate/CROPPED/*.bmp
    """
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

# Image Preprocessing Function
def preprocess_images(image, target_size=(224, 224)):
    proc_imgs = []
    # Resize image to target size
    img_resized = cv2.resize(image, target_size)
    img_array = img_to_array(img_resized)
    proc_imgs.append(img_array)
    return np.array(proc_imgs)

# Batch Feature Extraction Function Using ViT
def extract_feature(image):
    feature_extractor = ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224-in21k')
    vit_model = TFViTModel.from_pretrained('google/vit-base-patch16-224-in21k')
    
    features_list = []
    batch = image
    # Convert each image to PIL format
    pil_image = [Image.fromarray(img.astype('uint8'), 'RGB') for img in batch]
    inputs = feature_extractor(images=pil_image, return_tensors="tf")
    outputs = vit_model(inputs['pixel_values'])
    # Extract the [CLS] token embedding for each image
    features_batch = outputs.last_hidden_state[:, 0, :].numpy()
    features_list.append(features_batch)
    features = np.vstack(features_list)
    return features


# In a real application, this would be your trained model
# This is just a placeholder for demonstration
def predict_image(image_path):
    """
    This is a placeholder function that simulates model prediction.
    In a real application, you would:
    1. Load your trained TensorFlow/PyTorch model
    2. Preprocess the image (resize, normalize, etc.)
    3. Run inference with the model
    4. Parse and return the results

    For demonstration, this returns random results.
    """

    image = load_dataset(image_path)
    image = preprocess_images(image)
    features = extract_feature(image)
    best_pos = np.load('Artifacts/best_pos.npy')
    selected_features = best_pos.astype(bool)
    test_features = features[:, selected_features]

    # Load the SVM model
    model = joblib.load('Artifacts/svm_model.pkl')

    # Predict the class of the test image
    selected_class = model.predict(test_features)[0]

    selected_class=selected_class.replace('im_','')
    print(selected_class)

    # # Simulate loading and preprocessing the image
    # img = Image.open(image_path)
    # img = img.resize((224, 224))  # Common input size for CNNs
    
    # # Random selection from the five cell classes for demo purposes
    # cell_classes = [
    #     'Superficial-Intermediate',
    #     'Parabasal',
    #     'Koilocytotic',
    #     'Dyskeratotic',
    #     'Metaplastic'
    # ]
    
    # Randomly determine if it's potentially cancerous 
    # (in a real app, this would be predicted by your model)
    # Koilocytotic and Dyskeratotic are more likely to be potentially cancerous
    # selected_class = random.choice(cell_classes)
    
    # Higher probability of "cancerous" for certain cell types
    is_cancerous = True
    if selected_class == 'Parabasal' or selected_class == 'Superficial-Intermediate' or selected_class == 'Metaplastic':
        is_cancerous = False
    # else:
        # is_cancerous = random.random() > 0.8  # 20% chance of being cancerous
    
    return {
        'cellClass': selected_class,
        'isCancerous': is_cancerous
    }

@app.route('/api/predict', methods=['POST'])
def predict():
    # Check if image file is included in the request
    if 'image' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No image file provided'
        }), 400
    
    file = request.files['image']
    
    # Check if a valid file was uploaded
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No image selected'
        }), 400
    
    if file:
        # Save the file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        try:
            # Get prediction
            result = predict_image(file_path)
            
            # Clean up - delete the file after prediction
            # os.remove(file_path)
            
            # Return results
            return jsonify({
                'success': True,
                'data': result
            })
        except Exception as e:
            # Clean up in case of error
            if os.path.exists(file_path):
                os.remove(file_path)
            
            return jsonify({
                'success': False,
                'error': f'Error during prediction: {str(e)}'
            }), 500
    
    return jsonify({
        'success': False,
        'error': 'Invalid file format. Please upload a JPG, JPEG, or PNG image.'
    }), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint to verify API is running"""
    return jsonify({
        'status': 'ok',
        'message': 'Cervical Cancer Detection API is running'
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)