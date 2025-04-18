# Image Upload API

## Overview
This API provides a backend service to support image uploads from a front-end application (such as a Shopify theme). When an image is uploaded:
1. The image file is stored in AWS-S3.
2. Its metadata is inserted into a PostgreSQL table (`image_metadata`).
3. A URL is generated, allowing temporary access to the image in S3.
4. The API responds with a success message along with the image metadata and URL.

## Project Structure
The repository is organized as follows:

image-upload-api/

└─  uploadController.js      
└─  upload.test.js           
└─  routes.js                
└─  app.js                   
└─ .env                     
└─ package.json             
└─ package-lock.json        
└─ README.md                

## Installation and Setup

1. Clone the Repository
```bash
git clone https://github.com/dev-VAIN/image-upload-api.git
cd image-upload-api
```
2. Install Node.js

* For Windows
  
Go to the official [Node.js website](https://nodejs.org/), click **LTS**, and download the version.

*  For MacOS

Use homebrew to install Node.js
```bash
brew install node
```

3. Install Dependencies
```bash
npm install
```

4. Configure Environment Variables
 
* .env
```bash
AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1

S3 Configuration
S3_BUCKET_NAME=your-project-name-uploads

PostgreSQL Configuration
DATABASE_URL=postgresql://admin:admin@your-rds-endpoint:5432/imagedb
```

5. Start the Server
```bash
node app.js
```

## Unit Testing

- Running Tests
```bash
npm test
```

