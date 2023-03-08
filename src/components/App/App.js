import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playListName: 'My Playlist',
      playListTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playListTracks;

    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);

    this.setState({ playListTracks: tracks });
  }

  updatePlayListName(name) {
    this.setState({ playListName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playListTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playListName, trackUris).then(() => {
      this.setState({ 
        playListName: 'New Playlist',
        playListTracks: []
      })
    })
  }

  search(term) {
    console.log(term)
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  componentDidMount() {
    window.addEventListener('load', Spotify.search(''));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} 
                          onAdd={this.addTrack} />
          <Playlist playListName={this.state.playListName} 
                    playListTracks={this.state.playListTracks}
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlayListName}
                    onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}
