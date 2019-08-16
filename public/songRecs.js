const baseurl = "https://api.spotify.com/v1";

/***********************************************************
* Get authorization token
***********************************************************/
function getAccessToken(callback, id) {
    let accessToken = ""
    // Make a POST request for OAuth Token
    let tokenRequest = new XMLHttpRequest();
    tokenRequest.open("POST", "/getToken");
    tokenRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let accessToken = tokenRequest.responseText;
            callback(accessToken, id)
        }
    };
    var params = "grant_type=client_credentials";
    tokenRequest.send();
}

/***********************************************************
* Search for the list of songs
***********************************************************/
function search() {
    getAccessToken(searchSongs);
    
}

/***********************************************************
* Search for the list of songs
***********************************************************/
function searchSongs(accessToken, id = null) {
    // Make request for song
    let songRequest = new XMLHttpRequest();
    songRequest.open("POST", "/getSong");
    songRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(songRequest.responseText);
            displaySearchResults(response);
        }
    };
    songRequest.setRequestHeader('Content-Type', 'application/json');
    let song = document.getElementById("search").value;
    let url = baseurl + "/search?q=" + song + "&type=track";
    var data = {
        accessToken: accessToken,
        song: song,
        url: url
    }
    songRequest.send(JSON.stringify(data));
}

function displaySearchResults(results) {
    document.getElementById("search-title").style.visibility = "visible";
    let songTable = document.getElementById("songs");
    songTable.style.visibility = "visible";
    songTable.innerHTML = "";
    songTable.innerHTML = "<tr><th>Song</th><th>Artist</th><th>Album</th></tr>";
    songTable.innerHTML += "<tr>";
    results.tracks.items.forEach(element => {
        songTable.innerHTML += `<td><p onclick="getSongRec('${element.id}')">${element.name}</p></td><td>${element.artists[0].name}</td><td>${element.album.name}</td>`;
    });
}


/***********************************************************
* Display the list of recommended songs
***********************************************************/
function displaySongRecommendations(results) {
    let title = document.getElementById("recommendations-title");
    title.style.visibility = "visible";
    let recommendations = document.getElementById("recommendations");
    recommendations.innerHTML = "";
    recommendations.innerHTML = "<tr><th>Song</th><th>Artist</th><th>Album</th></tr>";
    results.forEach(element => {
        recommendations.innerHTML += `<td><a href="${element.external_urls.spotify}">${element.name}</p></td><td>${element.artists[0].name}</td><td>${element.album.name}</td>`;
    });
    title.scrollIntoView();
}

/***********************************************************
* Make the request to get song recommendations
***********************************************************/
function searchSong(accessToken, id) {
    // Make request for song
    let songRequest = new XMLHttpRequest();
    let url = baseurl + "/recommendations?market=US&seed_tracks=" + id + "&min_popularity=50";
    songRequest.open("POST", "/getRecs");
    songRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(songRequest.responseText);
            displaySongRecommendations(response.tracks);
        }
    };
    songRequest.setRequestHeader('Content-Type', 'application/json');
    var data = {
        accessToken: accessToken,
        song: id,
        url: url
    }
    songRequest.send(JSON.stringify(data));
    // songRequest.send();
}

/***********************************************************
* Get the song recommendations
***********************************************************/
function getSongRec(id) {
    getAccessToken(searchSong, id);
}