# Azure Database for MySQL Setup Guide

This guide will help you create and configure an Azure Database for MySQL instance for your portfolio contact form.

## Prerequisites

1. **Azure Account** - Sign up at [azure.microsoft.com](https://azure.microsoft.com)
2. **Azure CLI** (optional but recommended) - [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
3. **Node.js** - Version 14 or higher

## Step 1: Create Azure Database for MySQL

### Option A: Using Azure Portal (Recommended for beginners)

1. **Sign in to Azure Portal:**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create MySQL Database:**
   - Click "Create a resource"
   - Search for "Azure Database for MySQL"
   - Select "Azure Database for MySQL - Flexible Server" (recommended)
   - Click "Create"

3. **Configure the Database:**
   ```
   Subscription: [Your subscription]
   Resource Group: [Create new or select existing]
   Server Name: portfolio-mysql-[your-unique-id] (must be globally unique)
   Region: [Choose closest to your users]
   MySQL Version: 8.0.21 (recommended)
   Workload Type: Development
   Compute + Storage: Burstable, B1ms (1 vCore, 2 GB RAM) - $12.41/month
   ```

4. **Set Admin Credentials:**
   ```
   Admin Username: portfolio_admin
   Password: [Generate a strong password - save this!]
   ```

5. **Configure Networking:**
   ```
   Connectivity Method: Public access (selected IP addresses)
   Firewall Rules: Add your current IP address
   ```

6. **Review and Create:**
   - Review all settings
   - Click "Create"
   - Wait for deployment (5-10 minutes)

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name portfolio-rg --location eastus

# Create MySQL server
az mysql flexible-server create \
  --resource-group portfolio-rg \
  --name portfolio-mysql-$(date +%s) \
  --location eastus \
  --admin-user portfolio_admin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 32 \
  --version 8.0.21

# Create firewall rule for your IP
az mysql flexible-server firewall-rule create \
  --resource-group portfolio-rg \
  --name portfolio-mysql-$(date +%s) \
  --rule-name AllowMyIP \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

## Step 2: Get Connection Information

After creation, note down these details from the Azure Portal:

1. **Server Name:** `portfolio-mysql-[your-id].mysql.database.azure.com`
2. **Admin Username:** `portfolio_admin`
3. **Password:** [The password you set]
4. **Port:** `3306` (default)

## Step 3: Create Database and User

### Using Azure Portal:

1. **Open Query Editor:**
   - Go to your MySQL server in Azure Portal
   - Click "Query editor" in the left menu
   - Sign in with your admin credentials

2. **Run these SQL commands:**
```sql
-- Create database
CREATE DATABASE portfolio_contacts;

-- Create application user
CREATE USER 'portfolio_app'@'%' IDENTIFIED BY 'YourAppPassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON portfolio_contacts.* TO 'portfolio_app'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the database
USE portfolio_contacts;

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
```

### Using MySQL Client:

```bash
# Connect to your Azure MySQL server
mysql -h portfolio-mysql-[your-id].mysql.database.azure.com \
      -u portfolio_admin \
      -p \
      --ssl-mode=REQUIRED

# Then run the SQL commands above
```

## Step 4: Configure Your Application

1. **Update your `.env` file:**
```env
# Azure MySQL Configuration
DB_HOST=portfolio-mysql-[your-id].mysql.database.azure.com
DB_USER=portfolio_app
DB_PASSWORD=YourAppPassword123!
DB_NAME=portfolio_contacts
DB_PORT=3306
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=production
```

2. **Update your backend server.js to handle SSL:**
```javascript
// Add SSL configuration for Azure
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});
```

## Step 5: Configure Firewall Rules

### Allow Your Application Server:

1. **In Azure Portal:**
   - Go to your MySQL server
   - Click "Networking" in the left menu
   - Add firewall rule for your application server's IP

2. **For Development (temporary):**
   - Add your current IP address
   - Or use `0.0.0.0 - 255.255.255.255` (NOT recommended for production)

### For Production Deployment:

If deploying to Azure App Service, Heroku, or other cloud platforms:

1. **Get your app's outbound IP addresses**
2. **Add them to the firewall rules**
3. **Or use VNet integration for better security**

## Step 6: Test the Connection

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Start your backend server:**
```bash
npm start
```

3. **Test the connection:**
```bash
curl http://localhost:5000/api/health
```

4. **Test form submission:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","reason":"Testing Azure MySQL"}'
```

## Step 7: Security Best Practices

### Production Security:

1. **Use Application User:**
   - Don't use the admin user in your application
   - Create a dedicated application user with limited privileges

2. **Enable SSL:**
   - Always use SSL connections in production
   - Set `DB_SSL=true` in your environment variables

3. **Firewall Rules:**
   - Only allow specific IP addresses
   - Remove the `0.0.0.0 - 255.255.255.255` rule in production

4. **Connection String Security:**
   - Store credentials in environment variables
   - Never commit credentials to version control
   - Use Azure Key Vault for production secrets

5. **Regular Backups:**
   - Azure automatically backs up your database
   - Configure backup retention period
   - Test restore procedures

## Step 8: Monitoring and Maintenance

### Azure Portal Monitoring:

1. **Metrics:**
   - CPU usage
   - Memory usage
   - Connection count
   - Storage usage

2. **Alerts:**
   - Set up alerts for high CPU/memory usage
   - Monitor connection failures
   - Set up alerts for storage space

3. **Logs:**
   - Enable slow query logs
   - Monitor error logs
   - Set up log analytics

## Cost Optimization

### Azure MySQL Pricing:

- **Basic Tier:** $12.41/month (B1ms - 1 vCore, 2 GB RAM)
- **Standard Tier:** $24.82/month (S1 - 1 vCore, 2 GB RAM)
- **Premium Tier:** $49.64/month (P1 - 1 vCore, 2 GB RAM)

### Cost-Saving Tips:

1. **Use Burstable Tier** for development
2. **Scale down** during non-peak hours
3. **Use reserved capacity** for production
4. **Monitor usage** and optimize queries
5. **Set up auto-shutdown** for development environments

## Troubleshooting

### Common Issues:

1. **Connection Timeout:**
   - Check firewall rules
   - Verify SSL configuration
   - Check network connectivity

2. **Authentication Failed:**
   - Verify username and password
   - Check user privileges
   - Ensure user exists

3. **SSL Certificate Issues:**
   - Use `rejectUnauthorized: false` for development
   - Configure proper SSL certificates for production

4. **Performance Issues:**
   - Monitor query performance
   - Add proper indexes
   - Consider scaling up

### Support Resources:

- [Azure Database for MySQL Documentation](https://docs.microsoft.com/en-us/azure/mysql/)
- [Azure Support](https://azure.microsoft.com/en-us/support/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Next Steps

1. **Deploy to Production:**
   - Set up proper environment variables
   - Configure SSL certificates
   - Set up monitoring and alerts

2. **Backup Strategy:**
   - Configure automated backups
   - Test restore procedures
   - Set up point-in-time recovery

3. **Security Hardening:**
   - Implement proper firewall rules
   - Use Azure Key Vault for secrets
   - Enable audit logging
