import React from 'react';
import {
  Layout,
  Button,
  Modal,
  Icon,
  notification,
  Card,
  Spin,
  Tooltip,
} from 'antd';
const { confirm } = Modal;
const { Header, Content, Sider } = Layout;
import { reactLocalStorage } from 'reactjs-localstorage';
import MediaSettings from './settings';
import ChatFeed from './chat/index';
import Message from './chat/message';
import bLogo from '../public/100ms-logo-on-black.png';
import '../styles/css/app.scss';

import LoginForm from './LoginForm';
import Conference from './Conference';
import { Client } from 'brytecam-sdk-js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      login: false,
      loading: false,
      localAudioEnabled: true,
      localVideoEnabled: true,
      screenSharingEnabled: false,
      collapsed: true,
      isFullScreen: false,
      vidFit: false,
      loginInfo: {},
      messages: [],
    };

    this._settings = {
      selectedAudioDevice: '',
      selectedVideoDevice: '',
      resolution: 'qvga',
      bandwidth: 256,
      codec: 'vp8',
      //codec: "h264",
      isDevMode: true,
    };

    let settings = reactLocalStorage.getObject('settings');
    if (settings.codec !== undefined) {
      this._settings = settings;
    }
  }

  _cleanUp = async () => {
    window.history.pushState({}, '100ms', 'https://' + window.location.host);
    await this.conference.cleanUp();
    await this.client.leave();
  };

  _notification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: 'bottomRight',
    });
  };

  _createClient = (env = 'conf') => {
    let url = `wss://${env}.brytecam.com`;
    //TODO replace for each location
    const token = process.env.TOKEN;
    //for dev by scripts
    // if (process.env.NODE_ENV == 'development') {
    //   const proto = this._settings.isDevMode ? 'wss' : 'wss';
    //   url = proto + '://' + window.location.host;
    // }
    try {
      let client = new Client({ url: url, token: token });
      client.url = url;
      return client;
    } catch (err) {
      console.error(err);
      alert('Invalid token');
    }
  };

  _handleJoin = async values => {
    this.setState({ loading: true });
    let settings = this._settings;
    settings.selectedVideoDevice = values.selectedVideoDevice;
    settings.selectedAudioDevice = values.selectedAudioDevice;
    //TODO this should reflect in initialization as well

    this._onMediaSettingsChanged(
      settings.selectedAudioDevice,
      settings.selectedVideoDevice,
      settings.resolution,
      settings.bandwidth,
      settings.codec,
      settings.isDevMode      
    );

    let client = this._createClient(values.env?values.env:"conf");

    window.onunload = async () => {
      await this._cleanUp();
    };

    client.on('peer-join', (id, info) => {
      //this._notification("Peer Join", "peer => " + info.name + ", join!")
    });

    client.on('peer-leave', id => {
      //this._notification("Peer Leave", "peer => " + id + ", leave!")
    });

    client.on('transport-open', () => {
      console.log('transport open!');
      this._handleTransportOpen(values);
    });

    client.on('transport-closed', () => {
      console.log('transport closed!');
    });

    client.on('stream-add', (id, info) => {
      console.log('stream-add %s,%s!', id, info);
      //this._notification("Stream Add", "id => " + id + ", name => " + info.name)
    });

    client.on('stream-remove', stream => {
      console.log('stream-remove %s,%', stream.id);
      //this._notification("Stream Remove", "id => " + stream.id)
    });

    client.on('broadcast', (mid, info) => {
      console.log('broadcast %s,%s!', mid, info);
      this._onMessageReceived(info);
    });

    this.client = client;
  };

  _handleTransportOpen = async values => {
    console.log(values);
    reactLocalStorage.remove('loginInfo');
    reactLocalStorage.setObject('loginInfo', values);
    await this.client.join(values.roomId, { name: values.displayName });
    //TODO ugly hack
    window.history.pushState(
      {},
      '100ms',
      'https://' + window.location.host + '/?room=' + values.roomId + '&env=' + values.env
    );
    this.setState({
      login: true,
      loading: false,
      loginInfo: values,
      localVideoEnabled: !values.audioOnly,
      localAudioEnabled: !values.videoOnly,
    });

    this._notification(
      'Connected!',
      'Welcome to the brytecam room => ' + values.roomId
    );
    await this.conference.handleLocalStream(true, {
      uid: this.client.uid,
      rid: values.roomId,
    });
  };

  _handleLeave = async () => {
    let client = this.client;
    let this2 = this;
    confirm({
      title: 'Leave Now?',
      content: 'Do you want to leave the room?',
      async onOk() {
        console.log('OK');
        await this2._cleanUp();
        this2.setState({ login: false });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  _handleAudioTrackEnabled = enabled => {
    this.setState({
      localAudioEnabled: enabled,
    });
    this.conference.muteMediaTrack('audio', enabled);
  };

  _handleVideoTrackEnabled = enabled => {
    this.setState({
      localVideoEnabled: enabled,
    });
    this.conference.muteMediaTrack('video', enabled);
  };

  _handleScreenSharing = enabled => {
    this.setState({
      screenSharingEnabled: enabled,
    });
    this.conference.handleScreenSharing(enabled);
  };

  _onRef = ref => {
    this.conference = ref;
  };

  _openOrCloseLeftContainer = collapsed => {
    this.setState({
      collapsed: collapsed,
    });
  };

  _onVidFitClickHandler = () => {
    this.setState({
      vidFit: !this.state.vidFit,
    });
  };

  _onFullScreenClickHandler = () => {
    let docElm = document.documentElement;

    if (this._fullscreenState()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      this.setState({ isFullScreen: false });
    } else {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }

      this.setState({ isFullScreen: true });
    }
  };

  _fullscreenState = () => {
    return (
      document.fullscreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      false
    );
  };

  _onMediaSettingsChanged = (
    selectedAudioDevice,
    selectedVideoDevice,
    resolution,
    bandwidth,
    codec,
    isDevMode,
    reloadPage = false,
  ) => {
    this._settings = {
      selectedAudioDevice,
      selectedVideoDevice,
      resolution,
      bandwidth,
      codec,
      isDevMode,
    };
    reactLocalStorage.setObject('settings', this._settings);
    //TODO hack to make sure settings change happens. Should be replaced by applyMediaConstraints
    if(reloadPage) window.location.reload();
  };

  _onMessageReceived = data => {
    console.log('Received message:' + data.senderName + ':' + data.msg);
    let messages = this.state.messages;
    let uid = 1;
    messages.push(
      new Message({ id: uid, message: data.msg, senderName: data.senderName })
    );
    this.setState({ messages });
  };

  _onSendMessage = data => {
    console.log('Send message:' + data);
    var info = {
      senderName: this.state.loginInfo.displayName,
      msg: data,
    };
    this.client.broadcast(info);
    let messages = this.state.messages;
    let uid = 0;
    messages.push(new Message({ id: uid, message: data, senderName: 'me' }));
    this.setState({ messages });
  };

  render() {
    const {
      login,
      loading,
      localAudioEnabled,
      localVideoEnabled,
      screenSharingEnabled,
      collapsed,
      vidFit,
    } = this.state;
    return (
      <Layout className="app-layout">
        <Header
          className="app-header"
          style={{
            backgroundColor: '#1a1619',
            zIndex: '10',
            padding: '0 0',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div className="app-header-left">
            <a href="https://brytecam.dev" target="_blank">
              <img src={bLogo} className="h-8" />
            </a>
          </div>
          <div className="app-header-right">
            <MediaSettings
              onMediaSettingsChanged={this._onMediaSettingsChanged}
              settings={this._settings}
            />
          </div>
        </Header>

        <Content className="app-center-layout">
          {login ? (
            <Layout className="app-content-layout">
              <Sider
                width={320}
                collapsedWidth={0}
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
                style={{ backgroundColor: '#1a1619' }}
              >
                <div className="left-container">
                  <ChatFeed
                    messages={this.state.messages}
                    onSendMessage={this._onSendMessage}
                  />
                </div>
              </Sider>
              <Layout className="app-right-layout">
                <Content style={{ flex: 1, position: 'relative' }}>
                  <div>
                    <Conference
                      collapsed={this.state.collapsed}
                      client={this.client}
                      settings={this._settings}
                      localAudioEnabled={localAudioEnabled}
                      localVideoEnabled={localVideoEnabled}
                      vidFit={vidFit}
                      loginInfo={this.state.loginInfo}
                      ref={ref => {
                        this.conference = ref;
                      }}
                      isScreenSharing={screenSharingEnabled}
                      onScreenToggle={() =>
                        this._handleScreenSharing(!screenSharingEnabled)
                      }
                      onLeave={this._handleLeave}
                      onChatToggle={() =>
                        this._openOrCloseLeftContainer(!collapsed)
                      }
                      isChatOpen={!this.state.collapsed}
                    />
                  </div>
                </Content>
              </Layout>
            </Layout>
          ) : loading ? (
            <Spin size="large" tip="Connecting..." />
          ) : (
            <div className="relative w-full mt-16">
              <LoginForm
                handleLogin={this._handleJoin}
                createClient={this._createClient}
              />
            </div>
          )}
        </Content>
      </Layout>
    );
  }
}

export default App;
