<h1 align="center">👁️ RealEyes</h1>
<p align="center">
  <em>An AI-powered application for detecting deepfake videos and audio manipulation</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TensorFlow-2.0-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Flask-WebApp-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/DeepLearning-CNN/RNN-purple?style=for-the-badge" />
</p>

---

## 📌 Project Overview

**RealEyes** is an AI-powered web application designed to detect:
- 🧑‍🎤 Face-swapped **deepfake videos**
- 🔊 Voice-manipulated **deepfake audios**

Using cutting-edge deep learning techniques like **CNNs** and **RNNs**, it analyzes inconsistencies in video frames and audio spectrograms to detect forgeries.

---

## 💡 Features

- 🔍 Frame-by-frame deepfake video analysis
- 🧠 Audio manipulation detection using spectrogram classification
- 🛡️ CNN and RNN-based model pipeline
- 📂 Upload and scan video/audio files directly
- 💻 Flask-based interactive web interface

---

## 🗂️ Project Structure

RealEyes/
│
├── public/ # Static assets
├── src/ # Core processing logic
├── uploads/ # Uploaded files by users
├── working/ # Intermediate file processing
│
├── app.py # Main Flask app
├── deepfake_detection.py # Deepfake video analysis logic
├── audio_detection_V.ipynb # Audio detection notebook (Colab)
├── model_best.keras # Pre-trained DL model
├── metadata.json # Model or session metadata
├── .env # Environment variables
├── package.json # NPM dependencies (if frontend)
├── README.md # You're here!


---

## 🚀 Getting Started

### 📦 Prerequisites

Ensure you have the following installed:

- Python 3.9+
- pip
- virtualenv (recommended)

### 🔧 Installation

```bash
git clone https://github.com/vidhirawat10/RealEyes.git
cd RealEyes
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```
⚠️ You may need to configure .env file with necessary environment variables.

### 🧪 Run the App

```bash
python app.py
```
Visit: http://127.0.0.1:5000

---

## 🧠 Model Details
Video Detection: Uses CNNs to detect visual inconsistencies in facial expressions, movements, and textures.

Audio Detection: Uses RNNs (e.g., LSTM) trained on spectrograms to detect abnormal patterns in speech signals.

---

## 🤖 Tech Stack
- Frontend: HTML, CSS, JS (via public/)

- Backend: Python (Flask)

- AI Models: Keras/TensorFlow-based CNN & RNN

- Notebook: Google Colab for audio model prototyping

---

## ## 🙋‍♀️ Authors

Made with 🔬 by **Vidhi Rawat** and **Aayush Shukla**  
🌐 [GitHub – Vidhi](https://github.com/vidhirawat10) • [GitHub – Aayush](https://github.com/AayushShukla1438)  
✉️ [Email – Vidhi](mailto:vidhirawat54@gmail.com) • [Email – Aayush](mailto:aayushshukla1438@gmail.com )

---

<p align="center"><i>RealEyes - Because real eyes recognize real lies.</i></p>


