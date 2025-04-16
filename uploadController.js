const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');


// --------------------------------------------------------------
// PostgreSQL setup
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


// ---------------------------------------------------------------
// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();


// We switched from DynamoDB to PostgreSQL for metadata storage.
// const dynamoDB = new AWS.DynamoDB.DocumentClient();  


// Configure multer for file uploads to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private', // Or 'public-read' if you want public access !!!!!!!!!!!!!!!! 
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `uploads/${uuidv4()}.${fileExtension}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Express route handler
exports.uploadImage = async (req, res) => {
  // multer middleware for single file upload
  const uploadSingle = upload.single('image');

  console.log('Incoming upload request...');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  uploadSingle(req, res, async function(err) {
    console.log('File:', req.file);
    console.log('Form fields:', req.body);

    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    // If no file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {

      // ==========================================================
      // Save metadata to DynamoDB
      // const imageData = {
      //   TableName: process.env.DYNAMODB_TABLE_NAME,
      //   Item: {
      //     id: uuidv4(),
      //     s3Key: req.file.key,
      //     originalName: req.file.originalname,
      //     mimeType: req.file.mimetype,
      //     size: req.file.size,
      //     description: req.body.description || '',
      //     uploadDate: new Date().toISOString(),
      //     analyzed: false // Will be set to true after analysis
      //   }
      // };
      
      // await dynamoDB.put(imageData).promise();
      
      // Trigger image analysis (could be async via AWS Lambda)
      // triggerImageAnalysis(imageData.Item.id);
      
      // Generate a pre-signed URL for temporary access
      // ===========================================================


      // Postgre Database Insertion
      const imageName = req.file.originalname;
      const uploadPath = req.file.key;
      const uploadDate = new Date().toISOString();
      const userId = 1; // TEMP user ID — update when user auth is added!!!

      // Insert into PostgreSQL
      const result = await pool.query(
        `INSERT INTO image_metadata (user_id, image_name, upload_path, upload_date)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [userId, imageName, uploadPath, uploadDate]
      );

      const imageId = result.rows[0].id;

      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.key,
        Expires: 60 * 5 // URL expires in 5 minutes
      });
      
      // Send response to client
      res.status(200).json({
        message: 'Upload successful',
        imageId: imageId,
        imageUrl: signedUrl
      });
      
    } catch (error) {
      console.error('Error saving to database:', error);
      res.status(500).json({ error: 'Failed to process upload' });
    }
  });
};

module.exports.pool = pool;

