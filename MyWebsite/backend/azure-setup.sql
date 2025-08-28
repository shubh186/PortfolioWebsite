-- Azure SQL Server Database Setup Script
-- Run this script in Azure Portal Query Editor

-- Create contact submissions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='contact_submissions' AND xtype='U')
CREATE TABLE contact_submissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    reason NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_email' AND object_id = OBJECT_ID('contact_submissions'))
CREATE INDEX idx_email ON contact_submissions(email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_created_at' AND object_id = OBJECT_ID('contact_submissions'))
CREATE INDEX idx_created_at ON contact_submissions(created_at);

-- Insert sample data (optional)
IF NOT EXISTS (SELECT * FROM contact_submissions WHERE email = 'john@example.com')
INSERT INTO contact_submissions (name, email, reason) VALUES 
('John Doe', 'john@example.com', 'Interested in collaborating on a project');

IF NOT EXISTS (SELECT * FROM contact_submissions WHERE email = 'jane@example.com')
INSERT INTO contact_submissions (name, email, reason) VALUES 
('Jane Smith', 'jane@example.com', 'Looking for a software developer for my startup');

-- Verify the setup
SELECT 'Azure SQL Server database setup completed successfully!' as status;
SELECT COUNT(*) as total_submissions FROM contact_submissions;
SELECT DB_NAME() as current_database;
