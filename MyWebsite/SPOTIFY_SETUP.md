# Spotify Integration Setup Guide

This guide will help you set up the Spotify integration to show your real currently playing music on your portfolio.

## Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App name**: Your Portfolio (or any name you prefer)
   - **App description**: Portfolio website with Spotify integration
   - **Website**: Your portfolio URL (e.g., `https://yourname.github.io` or your domain)
   - **Redirect URI**: `http://localhost:3000/callback` (for development)
   - **API/SDKs**: Check "Web API"
5. Click "Save"

## Step 2: Get Your Client ID

1. After creating the app, you'll see your app dashboard
2. Copy the **Client ID** (not the Client Secret)
3. Open `MyWebsite/src/spotifyService.js`
4. Replace `'your_spotify_client_id'` with your actual Client ID:

```javascript
const CLIENT_ID = 'f2b7c80b32f94858b5481e36d25d9344';
```

## Step 3: Configure Redirect URIs

For production deployment, you'll need to add your live website's callback URL:

1. In your Spotify app dashboard, click "Edit Settings"
2. Add these Redirect URIs:
   - `http://localhost:3000/callback` (for development)
   - `https://yourdomain.com/callback` (for production)
   - `https://yourname.github.io/callback` (if using GitHub Pages)
3. Click "Save"

## Step 4: Test the Integration

1. Start your development server: `npm start`
2. Go to your portfolio
3. Click on the Spotify logo in the music card
4. You'll be redirected to Spotify to authorize the app
5. After authorization, you'll be redirected back to your portfolio
6. The card should now show your currently playing music!

## Features

- **Real-time updates**: Shows your currently playing track
- **Album art**: Displays the actual album artwork
- **Playing indicator**: Shows a play button when music is actively playing
- **Fallback**: Shows recently played if nothing is currently playing
- **Auto-refresh**: Updates every 30 seconds
- **Error handling**: Gracefully handles connection issues

## Troubleshooting

### "Invalid redirect URI" error
- Make sure your redirect URI in the Spotify app settings exactly matches your website URL + `/callback`
- For local development, use `http://localhost:3000/callback`
- For production, use your actual domain + `/callback`

### "App not found" error
- Double-check your Client ID is correct
- Make sure your Spotify app is not in "Development Mode" if you want others to use it

### No music showing
- Make sure you have Spotify open and playing music
- Check that you granted the necessary permissions during authorization
- Try disconnecting and reconnecting

### Token expired
- The app will automatically handle token refresh
- If issues persist, clear your browser's local storage and reconnect

## Security Notes

- Never commit your Client Secret to version control
- The Client ID is safe to include in your code
- Tokens are stored in browser's local storage and are user-specific
- Each user needs to authorize the app with their own Spotify account

## Production Deployment

When deploying to production:

1. Update the redirect URI in your Spotify app settings
2. Make sure your production URL is added to the allowed redirect URIs
3. Test the integration on your live site

## Need Help?

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web API Console](https://developer.spotify.com/console/)
- Check the browser console for any error messages
