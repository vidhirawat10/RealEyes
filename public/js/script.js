document.getElementById('file-upload').addEventListener('change', function() {
    const fileName = this.files[0]?.name || '';
    const uploadButton = document.getElementById('upload-btn');
    const fileNameBox = document.querySelector('.file-name-box');
    const uploadIcon = document.querySelector('.upload-icon');
    const browseButton = document.querySelector('.custom-file-upload');
    
    if (fileName) {
        uploadButton.style.display = 'block';
        fileNameBox.style.display = 'block';
        fileNameBox.textContent = fileName;
        uploadIcon.style.display = 'none';
        browseButton.style.display = 'none';
        uploadButton.textContent = 'Upload File';
    } else {
        uploadButton.style.display = 'none';
        fileNameBox.style.display = 'none';
        uploadIcon.style.display = 'block';
        browseButton.style.display = 'block';
        browseButton.textContent = 'Browse your File';
    }
});

// document.getElementById('upload-btn').addEventListener('click', function() {
//     const fileInput = document.getElementById('file-upload');
//     const formData = new FormData();
//     formData.append('video', fileInput.files[0]);

//     fetch('/predict', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         sessionStorage.setItem('uploadedFileUrl', URL.createObjectURL(fileInput.files[0]));
//         sessionStorage.setItem('isReal', data.isReal ? 'true' : 'false');
//         sessionStorage.setItem('accuracy', data.accuracy);
//         window.location.href = '../public/html/result.html';
//     })
//     .catch(error => {
//         console.error('Error uploading file:', error);
//     });
// });

document.getElementById('upload-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('file-upload');
    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Save the result in sessionStorage to use in result1.html
        sessionStorage.setItem('uploadedFileUrl', URL.createObjectURL(fileInput.files[0]));
        sessionStorage.setItem('isReal', data.isReal ? 'true' : 'false');
        sessionStorage.setItem('accuracy', data.accuracy);

        // Redirect to result1.html
        window.location.href = '../public/html/result1.html'; 
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});

function displayResult(isReal, fileUrl, accuracy) {
    const resultStatus = document.getElementById('result-status');
    const resultIcon = document.getElementById('result-icon');
    const uploadedFileImg = document.getElementById('uploaded-file');

    uploadedFileImg.src = fileUrl;

    if (isReal === 'true') {
        resultStatus.textContent = `Real (${accuracy}%)`;
        resultStatus.style.color = 'green';
        resultIcon.src = '../public/images/thumbup.png'; // Ensure the correct path to the image
    } else {
        resultStatus.textContent = `Fake (${accuracy}%)`;
        resultStatus.style.color = 'red';
        resultIcon.src = '../public.images/thumbdown.png'; // Ensure the correct path to the image
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const fileUrl = sessionStorage.getItem('uploadedFileUrl');
    const isReal = sessionStorage.getItem('isReal');
    const accuracy = sessionStorage.getItem('accuracy');

    if (fileUrl && isReal !== null) {
        displayResult(isReal, fileUrl, accuracy);
    }
});


function goBack() {
    window.location.href = '../public/html/upload.html';
}

// Function to update the result dynamically
function displayResult(isReal, fileUrl) {
    const resultStatus = document.getElementById('result-status');
    const resultIcon = document.getElementById('result-icon');
    const uploadedFileImg = document.getElementById('uploaded-file');

    uploadedFileImg.src = fileUrl;

    if (isReal === 'true') {
        resultStatus.textContent = 'Real';
        resultStatus.style.color = 'green';
        resultIcon.src = '../assets/thumbup.png'; 
    } else {
        resultStatus.textContent = 'Fake';
        resultStatus.style.color = 'red';
        resultIcon.src = '../assets/thumbdown.png'; 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const fileUrl = sessionStorage.getItem('uploadedFileUrl');
    const isReal = sessionStorage.getItem('isReal');

    if (fileUrl && isReal !== null) {
        displayResult(isReal, fileUrl);
    }
});


document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.querySelector('#loginForm input[name="email"]').value;
    const password = document.querySelector('#loginForm input[name="password"]').value;

    try {
        const response = await fetch('/loginin', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token); 
            alert('Login successful!');
            window.location.href = 'upload.html'; 
        } else {
            alert(result.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});


document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const messageElement = document.getElementById('message');

    if (data.password !== data.confirm_password) {
        messageElement.textContent = 'Passwords do not match!';
        messageElement.style.color = 'red';
        messageElement.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: data.full_name,
                email: data.email,
                password: data.password,
                confirm_password: data.confirm_password
            }),
        });

        if (response.ok) {
            messageElement.textContent = 'Sign-up successful!';
            messageElement.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 2000);
        } else {
            const result = await response.text();
            messageElement.textContent = result;
            messageElement.style.color = 'red';
            messageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'An error occurred. Please try again.';
        messageElement.style.color = 'red';
        messageElement.style.display = 'block';
    }
});
