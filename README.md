# GrownPlants-API

# Description
Created an API backend using **Node.js** and **express js** to make the end point. Next, we create an endpoint deployed on **Google Cloud Run**. This endpoint is packaged in a container with a **Dockerfile** and creates an **image container registry** to create a service on **Cloud Run**. When the mobile application hits the endpoint, the predicted image will be stored in the **Cloud Storage Bucket**. Also, for articles the images are stored on **Cloud Storage**. For our database we use **MongoDB Atlas Cloud** to store NoSQL users, articles, and history predicted from user data.

# Documentation
- Base URL : `https://grow-plants-ruca2dm4pa-et.a.run.app`

## Sign Up

- Method: `POST`
- Url: /api/v1/auth/signup
- Body: JSON
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

- Response : 
```json
{
    "error": "boolean",
    "message": "string"
}
```

## Sign In

- Method: `POST`
- Url: /api/v1/auth/signin
- Body: JSON
```json
{
  "email": "string",
  "password": "string",
}
```

- Response : 
```json
{
    "error": "boolean",
    "message": null,
    "data": {
        "token": "string"
    }
}
```

## Predict

- Method: `POST`
- Url: /api/v1/predict
- Header: Bearer token
- Body: `multipart/form-data`

| KEY | VALUE | 
| --------------- | --------------- | 
| file | file image | 

- Response :
```json
{
  "error": "boolean",
  "message": "string",
  "data": {
     "predicted_disease": "string",
     "articles": [
         {
           "imageUrl": "string",
           "name": "string",
           "category": "string",
           "description": "string",
           "prescription": ["string"],
           "prevention": ["string"]
         }
     ]
  }
}
```

## Profile

### Get Profile

- Method: `GET`
- Url: /api/v1/users/profile
- Header: Bearer token
- Response :
```json
{
  "error": "boolean",
  "message": "string",
  "data": [
    {
      "name":"string",
      "email": "string",
      "password": "string",
      "createdAt": "string",
      "imageUrl": "string",
    }
  ]
}
```

## History

### Get History

- Method: `GET`
- Url: /api/v1/users/history
- Header: Bearer token
- Response :
```json
{
  "error": "boolean",
  "message": "string",
  "data": [
    {
      "userId": "string",
      "email": "string",
      "imageUrl": "string",
       "articleIds": ["string"],
            "predictRate": "string",
            "createdAt": "string",
    }
  ]
}
```

## Articles

### Post Upload Article

- Method: `POST`
- Url: /api/v1/articles
- Header: Bearer token
- Body: `multipart/form-data`

| KEY | VALUE | 
| --------------- | --------------- | 
| file | file image | 
| name | "string" | 
| description  | "string" | 
| prescription  | ["string"] | 
| prevention  | ["string"] | 
| category  | "string" | 

- Response :
```json
{
  "error": "boolean",
  "message": "string",
  "data": [
    {
      "imageUrl": "string",
      "name": "string",
      "category": "string",
      "description": "string",
      "prescription": ["string"],
      "prevention": ["string"],
    }
  ]
}
```

### Get Articles

- Method: `GET`
- Url: /api/v1/articles
- Header Authorization : Bearer token
- Response :

```json
{
  "error": "boolean",
  "message": "string",
  "data": [
    {
      "imageUrl": "string",
      "name": "string",
      "category": "string",
      "description": "string",
      "prescription": ["string"],
      "prevention": ["string"],
    }
  ]
}
```

