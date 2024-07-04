console.log('app.js is running');

const appElement = document.getElementById('app');

function createDashboard(introductionData) {
    const dashboardHTML = `
        <div class="dashboard">
            <h1 class="dashboard-title">Dashboard</h1>
            <div class="introduction-box">
                <h2 class="introduction-title">Introduction</h2>
                <p class="introduction-message">${introductionData.message}</p>
            </div>
            <div class="upload-container">
                <form id="uploadForm" enctype="multipart/form-data">
                    <input type="file" id="fileInput" name="file" accept=".pdf" required />
                    <button type="submit">Upload</button>
                </form>
                <div id="output"></div>
            </div>
        </div>
    `;
    appElement.innerHTML = dashboardHTML;
    document.getElementById('uploadForm').addEventListener('submit', handleFileUpload);
}

async function fetchIntroductionData() {
    try {
        console.log('Fetching introduction data');
        const response = await fetch('introduction.json');
        const data = await response.json();
        console.log('Introduction data received:', data);
        createDashboard(data);
    } catch (error) {
        console.error('Error fetching introduction:', error);
        appElement.innerHTML = '<p>Error loading dashboard. Please try again later.</p>';
    }
}

async function handleFileUpload(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.error || 'Unknown error occurred');
        }

        const result = await response.json();
        document.getElementById('output').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error uploading file:', error);
        document.getElementById('output').innerText = `Error uploading file: ${error.message}`;
    }
}

fetchIntroductionData();

console.log('app.js execution completed');
