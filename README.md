# Real Estate Application

## Overview

This project is a web application for managing rental properties where users can register as either buyers or sellers. Sellers can post and manage their properties, while buyers can view and express interest in these properties. The application includes both basic and advanced features to enhance user experience.

## Project Structure

The project is divided into two main folders:
1. `backend`: Contains the server-side code using Node.js and Express.
2. `frontend`: Contains the client-side code using React.js.

## Features

### Part I: Basic Application

#### User Registration & Login
- **Registration Fields:**
  - First Name
  - Last Name
  - Email
  - Phone Number
- **Note:** Users can register as either sellers or buyers.

#### Seller Flow
- **Post Property:**
  - Sellers can post properties with details such as place, area, number of bedrooms, bathrooms, hospitals & colleges nearby, etc.
- **View Posted Properties:**
  - Sellers can see the properties they have posted.
- **Update/Delete Properties:**
  - Sellers can update or delete their properties.

#### Buyer Flow
- **View Properties:**
  - Buyers can view all posted rental properties.
- **Express Interest:**
  - Buyers can click on an "I'm Interested" button to view seller details.
- **Filter Properties:**
  - Buyers can apply filters based on property details.

### Part II: Advanced Features

- **Pagination:**
  - Implemented for property listings.
- **Form Validation:**
  - Proper validation for all form inputs.
- **Mandatory Login:**
  - Buyers must log in to view seller details. Unauthorized users attempting to access seller information will be redirected to the login screen.
- **Like Button:**
  - Buyers can like properties, and likes are tracked in real-time.
- **Email Notifications:**
  - When a buyer clicks "I'm Interested", the buyer receives the seller’s contact details via email, and the seller gets an email with the interested buyer's details.

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database URL.

### Navigate to the project directory:
```sh
cd backend
npm install
```
 - Set up the environment variables:
 - open .env file in the backend folder.
 - add your MongoDB database URL:MONGO_URL=<your_mongo_database_url>
```sh 
npm run dev
cd ../frontend
npm install
npm run dev
```

## Home Page for Buyer
![Alt text](Pictures/Home.png?raw=true "Title")
## Sharing Page for Buyer
![Alt text](Pictures/Sharingcontact.png?raw=true "Title")
## Sigup Page 
![Alt text](Pictures/Signup.png?raw=true "Title")
## Login Page 
![Alt text](Pictures/login.png?raw=true "Title")
## Home Page for Seller
![Alt text](Pictures/Seller.png?raw=true "Title")
### Add From Page for Seller
![Alt text](Pictures/AddProperty.png?raw=true "Title")
### Update From Page for Seller
![Alt text](Pictures/UpadteProperty.png?raw=true "Title")