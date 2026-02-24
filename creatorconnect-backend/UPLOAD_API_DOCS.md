# Cloudinary Image & Video Upload API

This backend now uses **Cloudinary** for storing and managing images and videos. All media files are automatically uploaded to Cloudinary instead of local storage.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend root directory with the following variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
```

Get these credentials from [Cloudinary Dashboard](https://cloudinary.com/console/)

## API Endpoints

### Upload Single Image/Video
**POST** `/upload/single`

**Headers:**
- `Authorization: Bearer <token>` (Required - user must be authenticated)
- `Content-Type: multipart/form-data`

**Body:**
- `file` (required): Image or video file

**Request Example:**
```bash
curl -X POST http://localhost:3000/upload/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "creatorconnect/images/...",
    "resourceType": "image",
    "mimeType": "image/jpeg",
    "size": 102400,
    "originalName": "image.jpg"
  }
}
```

### Upload Multiple Images/Videos
**POST** `/upload/multiple`

**Headers:**
- `Authorization: Bearer <token>` (Required)
- `Content-Type: multipart/form-data`

**Body:**
- `files` (required): Multiple image or video files (max 10 files)

**Request Example:**
```bash
curl -X POST http://localhost:3000/upload/multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@video1.mp4"
```

**Response:**
```json
{
  "success": true,
  "message": "2 file(s) uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "creatorconnect/images/...",
      "resourceType": "image",
      "mimeType": "image/jpeg",
      "size": 102400,
      "originalName": "image1.jpg"
    },
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "creatorconnect/videos/...",
      "resourceType": "video",
      "mimeType": "video/mp4",
      "size": 5242880,
      "originalName": "video1.mp4"
    }
  ]
}
```

## Supported File Types

### Images
- jpg, jpeg, png, gif, webp

### Videos
- mp4, avi, mov, mkv, webm

### File Limits
- Maximum file size: **100MB**
- Maximum files per upload: **10**

## Features

✅ **Automatic Cloudinary Upload** - Files are directly uploaded to Cloudinary  
✅ **Smart Folder Organization** - Images and videos stored in separate folders  
✅ **JWT Authentication** - Only authenticated users can upload  
✅ **Unique File Names** - Prevents file collisions with timestamps  
✅ **MIME Type Validation** - Only images and videos accepted  
✅ **Error Handling** - Detailed error messages for validation failures  

## Frontend Integration

Create a form with file input and send to the upload endpoints:

```javascript
const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:3000/upload/single", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data.data.url; // Returns Cloudinary URL
};
```

## Folder Structure in Cloudinary

```
creatorconnect/
├── images/      # All uploaded images
├── videos/      # All uploaded videos
└── uploads/     # Other file types
```

## Troubleshooting

**Error: "No file uploaded"**
- Ensure you're sending a file in the request body

**Error: "Authentication required"**
- Include valid JWT token in Authorization header

**Error: "Only images and videos are allowed"**
- Check file type - only images and videos are supported

**Error: "File size exceeds limit"**
- File is larger than 100MB - reduce file size

## Notes

- All files are uploaded to Cloudinary under the `creatorconnect` folder
- URLs returned are permanent and can be used anywhere
- Cloudinary handles CDN distribution globally
- No local storage needed - reduces server load
