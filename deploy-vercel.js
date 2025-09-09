#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 * 
 * This script helps prepare and deploy the portfolio to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Portfolio Vercel Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('vercel.json')) {
  console.error('❌ vercel.json not found. Please run this from the project root.');
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI found');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Check if Frontend dependencies are installed
console.log('\n📦 Checking Frontend dependencies...');
if (!fs.existsSync('Frontend/node_modules')) {
  console.log('Installing Frontend dependencies...');
  execSync('cd Frontend && npm install', { stdio: 'inherit' });
} else {
  console.log('✅ Frontend dependencies found');
}

// Check if Backend dependencies are installed  
console.log('\n📦 Checking Backend dependencies...');
if (!fs.existsSync('Backend/node_modules')) {
  console.log('Installing Backend dependencies...');
  execSync('cd Backend && npm install', { stdio: 'inherit' });
} else {
  console.log('✅ Backend dependencies found');
}

// Build Frontend
console.log('\n🏗️  Building Frontend...');
try {
  execSync('cd Frontend && npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend built successfully');
} catch (error) {
  console.error('❌ Frontend build failed');
  process.exit(1);
}

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('\n✅ Deployment completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Set up environment variables in Vercel dashboard');
  console.log('2. Configure Spotify app with the new callback URL');
  console.log('3. Test your deployed application');
} catch (error) {
  console.error('❌ Deployment failed');
  process.exit(1);
}

