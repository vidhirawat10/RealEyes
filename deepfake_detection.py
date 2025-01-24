import argparse
import numpy as np
import tensorflow as tf
import cv2
import os
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import json
import sys
import os
import io
import time


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


model = tf.keras.models.load_model('./model/Deepfake_Detection_Model1.keras')


IMG_SIZE = 224
MAX_SEQ_LENGTH = 20
NUM_FEATURES = 2048


def build_feature_extractor():
    feature_extractor = tf.keras.applications.InceptionV3(
        weights='imagenet',
        include_top=False,
        pooling="avg",
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
    )
    preprocess_input = tf.keras.applications.inception_v3.preprocess_input
    
    inputs = tf.keras.Input((IMG_SIZE, IMG_SIZE, 3))
    preprocessed = preprocess_input(inputs)
    
    outputs = feature_extractor(preprocessed)
    return tf.keras.Model(inputs, outputs)

feature_extractor = build_feature_extractor()

def load_video(path, max_frames=20, resize=(224, 224)):
    cap = cv2.VideoCapture(path)

    frames = []
    frame_count = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret or (max_frames and frame_count >= max_frames):
                break
            frame_resized = cv2.resize(frame, resize)
            
            # Convert BGR to RGB by reordering the channels
            frame = frame_resized[:, :, [2, 1, 0]]
            
            frames.append(frame)
            frame_count += 1
            
            if len(frames) == max_frames:
                break
    finally:
        cap.release()
    
    return np.array(frames)

def crop_centre_square(frame):
    y, x = frame.shape[0:2]
    min_dim = min(y, x)
    start_x = (x // 2) - (min_dim // 2)
    start_y = (y // 2) - (min_dim // 2)
    return frame[start_y : start_y + min_dim, start_x : start_x + min_dim]

def prepare_single_video(frames):
    frames = frames[None, ...]
    frame_mask = np.zeros(shape=(1, MAX_SEQ_LENGTH,), dtype='bool')
    frame_features = np.zeros(shape=(1,MAX_SEQ_LENGTH, NUM_FEATURES), dtype="float32")
    
    for i, batch in enumerate(frames):
        video_length = batch.shape[0]
        length = min(MAX_SEQ_LENGTH, video_length)
        for j in range(length):
            frame_features[i,j, :] = feature_extractor.predict(batch[None,j, :])
        frame_mask[i, :length] = 1
    return frame_features, frame_mask

# # def predict_deepfake(video_path):
# #     frames = load_video(video_path, max_frames=MAX_SEQ_LENGTH)
# #     frames = np.array([crop_centre_square(frame) for frame in frames])
# #     frame_features, frame_mask = prepare_single_video(frames)
# #     prediction = model.predict([frame_features, frame_mask])
# #     is_deepfake: bool(prediction[0][0] > 0.55)
# #     accuracy: float(prediction[0][0])
    
# #     return{"isDeepFake": is_deepfake, "accuracy": accuracy}
# #     pass

# # def predict_deepfake(video_path):
# #     try:
# #         frames = load_video(video_path, max_frames=MAX_SEQ_LENGTH)
# #         frames = np.array([crop_centre_square(frame) for frame in frames])
# #         frame_features, frame_mask = prepare_single_video(frames)
# #         prediction = model.predict([frame_features, frame_mask])

# #         # Convert np.bool_ and np.float32 to native Python types
# #         is_deepfake = bool(prediction[0][0] > 0.55)
# #         accuracy = float(prediction[0][0])

# #     except Exception as e:
# #         # Handle any potential errors
# #         print(f"Error during prediction: {str(e)}", file=sys.stderr)
# #         is_deepfake = False
# #         accuracy = 0.0

# #     return {"isDeepfake": is_deepfake, "accuracy": accuracy}

def predict_deepfake(video_path):
    start_time = time.time()
    frames = load_video(video_path, max_frames=MAX_SEQ_LENGTH)
    print(f"Time to load video: {time.time() - start_time:.2f}s")

    frames = np.array([crop_centre_square(frame) for frame in frames])
    print(f"Time to crop frames: {time.time() - start_time:.2f}s")

    frame_features, frame_mask = prepare_single_video(frames)
    print(f"Time to extract features: {time.time() - start_time:.2f}s")

    prediction = model.predict([frame_features, frame_mask])
    print(f"Time to predict: {time.time() - start_time:.2f}s")

    is_deepfake = bool(prediction[0][0] > 0.55)
    accuracy = float(prediction[0][0])
    
    return {"isDeepfake": is_deepfake, "accuracy": accuracy}

# # def process_video(input_path, output_path):
# #     result = predict_deepfake(input_path)
# #     # Save the result to a JSON file
# #     with open(output_path, 'w') as f:
# #         json.dump(result, f)
        

# # if __name__ == "__main__":
# #     # Example usage:
# #     video_path = r"C:\Users\HP\Desktop\Video.mp4" # Replace with the actual video path
# #     prediction = predict_deepfake(video_path)
# #     print(f"Prediction: {'Fake' if prediction > 0.55 else 'Real'}")
# #     print(f"Probability of being fake: {prediction:.2f}")

# # if __name__ == "__main__":
# #     parser = argparse.ArgumentParser()
# #     parser.add_argument('--file', required=True, help="Path to the video file")
# #     args = parser.parse_args()

# #     result = predict_deepfake(args.file)
# #     if isinstance(result.get("isDeepfake"), np.bool_):
# #         result["isDeepfake"] = bool(result["isDeepfake"])

# #     # Serialize the result to JSON
# #     print(json.dumps(result))

# # def main():
# #     parser = argparse.ArgumentParser(description='Deepfake Detection')
# #     parser.add_argument('--file', type=str, help='Path to the video file')
# #     args = parser.parse_args()

# #     # Load the pre-trained model
# #     model = tf.keras.models.load_model('./model/Deepfake_Detection_Model1.keras')

# #     # Process the video and get the prediction
# #     prediction = process_video(args.file, model)
    
# #     # Convert prediction to a serializable format
# #     if isinstance(prediction, np.ndarray):
# #         prediction = prediction.tolist()  # Convert numpy array to a list
# #     elif isinstance(prediction, (np.float32, np.float64)):
# #         prediction = float(prediction)  # Convert numpy float to Python float
    
# #     result = {
# #         'prediction': prediction
# #     }
    
# #     # Write the result to a JSON file
# #     with open('result.json', 'w') as f:
# #         json.dump(result, f)

# #     # Print the result for debugging purposes
# #     print(json.dumps(result))

# # if __name__ == '__main__':
# #     main()

# # if __name__ == "__main__":
# #     parser = argparse.ArgumentParser()
# #     parser.add_argument('--file', required=True, help="Path to the video file")
# #     parser.add_argument('--output', required=True, help="Path to save the JSON result")
# #     args = parser.parse_args()

# #     process_video(args.file, args.output)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('video_path', type=str, help="Path to the video file")
    args = parser.parse_args()

    result = predict_deepfake(args.video_path)
    print(json.dumps(result))
