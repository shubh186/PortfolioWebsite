# Azure MySQL Testing Guide

Follow these steps to connect to your Azure MySQL database and test the contact form.

## Step 1: Create Azure MySQL Database

### 1.1 Go to Azure Portal
- Visit [portal.azure.com](https://portal.azure.com)
- Sign in with your Azure account

### 1.2 Create MySQL Database
- Click "Create a resource"
- Search for "Azure Database for MySQL"
- Select "Azure Database for MySQL - Flexible Server"
- Click "Create"

### 1.3 Configure Database
```
Resource Group: Create new (e.g., "portfolio-rg")
Server Name: portfolio-mysql-[your-unique-id] (must be globally unique)
Region: East US (or closest to you)
MySQL Version: 8.0.21
Admin Username: portfolio_admin
Password: [Create a strong password - save this!]
Compute + Storage: Burstable, B1ms (1 vCore, 2 GB RAM)
```

### 1.4 Configure Networking
```
Connectivity Method: Public access (selected IP addresses)
Firewall Rules: Add your current IP address
```

### 1.5 Create the Database
- Review settings and click "Create"
- Wait 5-10 minutes for deployment

## Step 2: Set Up Database Schema

### 2.1 Open Query Editor
- Go to your MySQL server in Azure Portal
- Click "Query editor" in the left menu
- Sign in with your admin credentials

### 2.2 Run Setup Script
Copy and paste this SQL into the Query Editor:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_contacts;
USE portfolio_contacts;

-- Create application user
CREATE USER 'portfolio_app'@'%' IDENTIFIED BY 'YourAppPassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON portfolio_contacts.* TO 'portfolio_app'@'%';
FLUSH PRIVILEGES;

-- Create table
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_email ON contact_submissions(email);
CREATE INDEX idx_created_at ON contact_submissions(created_at);

-- Insert test data
INSERT INTO contact_submissions (name, email, reason) VALUES 
('Test User', 'test@example.com', 'Testing the database connection');

-- Verify setup
SELECT 'Database setup completed!' as status;
SELECT COUNT(*) as total_submissions FROM contact_submissions;
```

## Step 3: Configure Your Application

### 3.1 Get Connection Details
From Azure Portal, note down:
- **Server Name:** `portfolio-mysql-[your-id].mysql.database.azure.com`
- **Admin Username:** `portfolio_admin`
- **Application Username:** `portfolio_app`
- **Application Password:** `YourAppPassword123!`

### 3.2 Update Environment File
```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
DB_HOST=portfolio-mysql-[your-id].mysql.database.azure.com
DB_USER=portfolio_app
DB_PASSWORD=YourAppPassword123!
DB_NAME=portfolio_contacts
DB_PORT=3306
DB_SSL=true
PORT=5000
NODE_ENV=development
```

## Step 4: Install and Start Backend

### 4.1 Install Dependencies
```bash
cd backend
npm install
```

### 4.2 Start Backend Server
```bash
npm start
```

You should see:
```
Connected to Azure MySQL database
Contact submissions table ready
Server running on port 5000
```

## Step 5: Test the Connection

### 5.1 Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-01-XX..."
}
```

### 5.2 Test Contact Form Submission
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "reason": "Testing the contact form API"
  }'
```

Expected response:
```json
{
  "message": "Thank you for reaching out! I'll get back to you soon.",
  "success": true,
  "id": 2
}
```

### 5.3 View All Submissions
```bash
curl http://localhost:5000/api/contacts
```

## Step 6: Start Frontend and Test

### 6.1 Start React App
```bash
cd ..  # Back to MyWebsite root
npm start
```

### 6.2 Test Contact Form
- Go to `http://localhost:3000`
- Scroll to the contact form section
- Fill out the form and submit
- Check for success message

### 6.3 Verify Database
Go back to Azure Portal Query Editor and run:
```sql
USE portfolio_contacts;
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

## Troubleshooting

### Connection Issues
- **Error: "ECONNREFUSED"**
  - Check if Azure MySQL server is running
  - Verify firewall rules include your IP
  - Ensure SSL is enabled

- **Error: "Access denied"**
  - Verify username and password
  - Check if user has proper privileges
  - Ensure you're using the application user, not admin

- **Error: "SSL certificate"**
  - Make sure `DB_SSL=true` in your .env
  - The server is configured to handle SSL properly

### Common Commands
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check database connection
curl http://localhost:5000/api/contacts

# Test form submission
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","reason":"Testing"}'
```

### Azure Portal Commands
```sql
-- Check if table exists
SHOW TABLES;

-- View recent submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 5;

-- Check user privileges
SHOW GRANTS FOR 'portfolio_app'@'%';
```

## Success Indicators

✅ **Backend starts without errors**
✅ **Health endpoint returns OK**
✅ **Contact form submission works**
✅ **Data appears in Azure MySQL database**
✅ **Frontend shows success messages**

## Next Steps

Once testing is successful:
1. Deploy to production
2. Set up proper environment variables
3. Configure monitoring and alerts
4. Set up automated backups
5. Implement rate limiting for production
