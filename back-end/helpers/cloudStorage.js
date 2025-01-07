const BackblazeB2 = require('backblaze-b2');
const axios = require('axios');
const fs = require('fs')

// Initialize B2 instance
const initializeB2 = async () => {
    const b2 = new BackblazeB2({
        applicationKeyId: process.env.B2_KEY_ID,
        applicationKey: process.env.B2_APPLICATION_KEY,
    });

    await b2.authorize();
    return b2;
};

// Upload a file to B2
const uploadToB2 = async (b2, bucketName, fileData, fileName) => {
    // Get bucket details
    const bucket = await b2.getBucket({ bucketName });
    const bucketId = bucket.data.buckets[0].bucketId;

    // Get upload URL
    const uploadUrl = await b2.getUploadUrl({ bucketId });

    // Upload the file
    const response = await b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        fileName: fileName,
        data: fileData,
    });

    // Generate public URL for the uploaded file
    const fileUrl = `https://f000.backblazeb2.com/file/${bucketName}/${fileName}`;
    return fileUrl;
};

// Function to authorize the B2 account
const authorizeAccount = async (keyId, applicationKey) => {
    const url = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";
    try {
        const response = await axios.get(url, {
            auth: {
                username: keyId,
                password: applicationKey,
            },
        });

        const data = response.data;
        return {
            authorizationToken: data.authorizationToken,
            apiUrl: data.apiUrl,
            downloadUrl: data.downloadUrl,
        };
    } catch (error) {
        console.error(`Error authorizing account: ${error.response?.status} - ${error.response?.data}`);
        throw new Error("Failed to authorize Backblaze B2 account.");
    }
};

// Function to get download authorization token
const getDownloadAuthorization = async (authToken, apiUrl, bucketId, fileNamePrefix = "", validDuration = 6000) => {
    const url = `${apiUrl}/b2api/v2/b2_get_download_authorization`;
    try {
        const response = await axios.post(
            url,
            {
                bucketId,
                fileNamePrefix,
                validDurationInSeconds: validDuration,
            },
            {
                headers: {
                    Authorization: authToken,
                },
            }
        );

        return response.data.authorizationToken;
    } catch (error) {
        console.error(`Error getting download authorization: ${error.response?.status} - ${error.response?.data}`);
        throw new Error("Failed to get download authorization.");
    }
};

// Function to download a file
const downloadFile = async (fullFileUrl, authorizationToken, localPath) => {
    try {
        const response = await axios.get(fullFileUrl, {
            headers: {
                Authorization: authorizationToken,
            },
            responseType: 'stream', // Ensures we handle the file stream correctly
        });

        const writer = fs.createWriteStream(localPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(`File downloaded successfully: ${localPath}`));
            writer.on('error', (error) => {
                console.error(`Error writing file: ${error.message}`);
                reject(new Error("Failed to download the file."));
            });
        });
    } catch (error) {
        console.error(`Error downloading file: ${error.response?.status} - ${error}`);
        throw new Error("Failed to download the file.");
    }
};


module.exports = {
    initializeB2,
    uploadToB2,
    authorizeAccount,
    getDownloadAuthorization,
    downloadFile
};
