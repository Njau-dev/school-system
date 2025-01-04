const BackblazeB2 = require('backblaze-b2');

const initializeB2 = async () => {
    const b2 = new BackblazeB2({
        applicationKeyId: process.env.B2_KEY_ID,
        applicationKey: process.env.B2_APPLICATION_KEY,
    });

    await b2.authorize();
    return b2;
};


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


module.exports = { initializeB2, uploadToB2 }