import React, { Component } from 'react';
import './App.css';
import SearchBar from '../../Components/SearchBar/SearchBar';
import SearchResults from '../../Components/SearchResults/SearchResults';
import Playlist from '../../Components/Playlist/Playlist';
import Spotify from '../../util/Spotify'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults : [],
      playlistName : "",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    //Check if the track being added to the playlist is already in the playlist
      if (this.state.playlistTracks.find(tracks => tracks.id === track.id)) {
          return;
      }
      let tracks = this.state.playlistTracks;
      tracks.push(track);
      this.setState({playlistTracks: tracks});
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(current => current.id !== track.id);
    this.setState({ playlistTracks: tracks});
  }
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);

    //reset search and results playlists to null
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('New Playlist');
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults}
                          onAdd = {this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks = {this.state.playlistTracks}
                      onRemove = {this.removeTrack}
                      onNameChange = {this.updatePlaylistName}
                      onSave = {this.savePlaylist} />
          </div>
        </div>
    </div>
    );
  }
}

export default App;
