import AWS from 'aws-sdk'

const bucketName = 'wareassets';

const s3 = new AWS.S3({
    accessKeyId: 'BF7RUARQRFFZZXYADUWT',
    region: 'fra1',
    endpoint: 'https://fra1.digitaloceanspaces.com',
    secretAccessKey: 'TFbCN81lgSma5zvPMG+/w17nnPLlLH+wI4O9m8C0XBQ',
});

const s3Uploader = async (data, fileName) => {
    return new Promise((resolve) => {
        const base64data = Buffer.from(data, 'base64');
        s3.putObject({
            Bucket: bucketName,
            Key: fileName,
            Body: base64data,
            ACL: 'public-read'
        }, (err, data) => {
            console.log(err, data)
            resolve(`https://${bucketName}.fra1.digitaloceanspaces.com/${fileName}`)
        });
    })
}

export default s3Uploader;