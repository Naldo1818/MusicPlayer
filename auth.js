const CLIENT_ID = '556d8b5482fa41b8b7c25ecc4cfcabc0';
const REDIRECT_URI = 'http://127.0.0.1:8000'; 
const SCOPES = 'streaming user-read-email user-read-private user-library-read user-read-playback-state user-modify-playback-state';

function redirectToSpotifyAuth() {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'token',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
    });

    window.location = `${authEndpoint}?${params.toString()}`;
}

function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}
