import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {emojify} from 'react-emojione';
import User from './User';
import Player from './User/Player';
import lobbyStyles from './Lobby.css';
import ChatBox from '../Chat/ChatBox';
import Rules from '../rules/Rules';
import logo from '../images/logo.png';
import trophy from '../images/icons/trophy.png';
import trophygold from '../images/icons/trophygold.png';
import pencil from '../images/icons/pencil.png';
import DrawCanvas from '../components/DrawCanvas';


import { RunCloakConfig } from '../services/cloak-service';

export class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: 0,
            drawCanvas: false,
            rules: false,
            filterOnline: false,
            sortRank: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.challengeUser = this.challengeUser.bind(this);
        this.cancelChallenge = this.cancelChallenge.bind(this);
        this.challengeRespond = this.challengeRespond.bind(this);
        this.observeGame = this.observeGame.bind(this);
        this.handleToggleRules = this.handleToggleRules.bind(this);
        this.handleAvatarClick = this.handleAvatarClick.bind(this);
        this.upload = this.upload.bind(this);
        this.filterOnline = this.filterOnline.bind(this);
        {this.getLobbyInfo()};
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            screenWidth: window.innerWidth
        });
    }

    reconnectWait() {
        setTimeout(() => {
            if (cloak.connected()) {
                cloak.message('reconnectuser', localStorage.getItem('userId'));
            } else {
                this.reconnectWait();
            }
        }, 300);
    }

    getLobbyInfo() {
        RunCloakConfig();
        if(cloak.connected()) {
            cloak.message('rejoingame');
            cloak.message('getlobbyinfo');
        } else {
            this.reconnectWait();
        }
    }

    challengeUser(id) {
        cloak.message('challengeplayer', id);
    }

    cancelChallenge(id) {
        cloak.message('cancelchallenge', id);
    }

    challengeRespond(accept, id) {
        if (accept) {
            cloak.message('acceptchallenge', id);
        } else {
            cloak.message('declinechallenge', id);
        }
    }

    observeGame(gameId) {
        cloak.message('observegame', gameId);
    }

    handleToggleRules() {
        this.setState({
            rules: !this.state.rules
        });
    }

    handleAvatarClick() {
        this.setState({
            drawCanvas: !this.state.drawCanvas
        });
    }

    upload() {
        this.handleAvatarClick();
        cloak.message('setavatar', this.refs.sketcher.refs.drawCanvas.toDataURL());
    }

    filterOnline() {
        this.setState({
            filterOnline: !this.state.filterOnline
        });
    }

    render() {
        let otherUsers = [];
        let name = '';
        let myCanvas = null;
        let userAvatar = null;
        let rank = '';

        var sortedList = Object.assign([], this.props.listOfUsers);
        if (this.state.sortRank) {
            sortedList.sort(function(a, b) {
                return a.rank - b.rank;
            });
        }
        sortedList.forEach((user) => {
            if (this.props.id !== user.id) {
                if (!(this.state.filterOnline && !user.online)) {
                    otherUsers.push(user);
                }
                return;
            }
            name = user.name;
            userAvatar = user.avatar;
            rank = user.rank;
            if (user.avatar) {
                myCanvas = document.getElementById('myavatar');
                if (myCanvas) {
                    setTimeout (() => {
                        var ctx = myCanvas.getContext('2d');
                        ctx.clearRect(0,0,myCanvas.width, myCanvas.height);
                        var img = new Image;
                        img.onload = function() {
                            ctx.drawImage(img, 0, 0, 300, 150);
                        };
                        img.src = user.avatar;
                    },50);
                }
            }
        });

        const userDisplayList = (
            otherUsers.map((user, i) => {
                const challenging = (this.props.challenging.indexOf(user.id) >= 0);
                const challenged = (this.props.challengers.indexOf(user.id) >= 0);
                return <User index={i} key={i} user={user} challenging={challenging} challenged={challenged} challengeUser={this.challengeUser} cancelChallenge={this.cancelChallenge} challengeRespond={this.challengeRespond} />;
            })
        );
        const gamesDisplayList = (
            this.props.listOfActiveGames.map((game, i) => {
                return (
                    <div key={i} className={lobbyStyles.game}>
                        <h1> {emojify(game.name)} </h1>
                        <button onClick={() => {this.observeGame(game.id)}}> Spectate </button>
                    </div>
                );
            })
        );

        const normalDisplay =
            <div className={lobbyStyles.container}>
                <div className={lobbyStyles.tabList}>
                    <div className={lobbyStyles.tab}>
                        <div>
                            <h1> USERS </h1>
                        </div>
                    </div>
                    <div className={lobbyStyles.tab}>
                        <h1> ACTIVE GAMES </h1>
                    </div>
                </div>
                <div className={lobbyStyles.tabPanel}>
                    <div className={lobbyStyles.tabPanelSort}>
                        <label  onClick={() => {this.setState({sortRank: !this.state.sortRank})}}>
                            <img src={this.state.sortRank ? trophygold : trophy} />
                            &nbsp;Sort
                        </label>
                    </div>
                    <div className={lobbyStyles.tabPanelFilter}><span><label><input defaultChecked={false} type="checkbox" onClick={this.filterOnline}/> Online only</label> </span></div>
                    {userDisplayList}
                </div>
                <div className={lobbyStyles.gameTabPanel}>
                    {gamesDisplayList}
                </div>
            </div>;
        const tabbedDisplay =
            <Tabs className={lobbyStyles.container} selectedTabClassName={lobbyStyles.selectedTab} selectedTabPanelClassName={lobbyStyles.tabPanel}>
                <TabList className={lobbyStyles.tabList}>
                    <Tab className={lobbyStyles.tab}>
                        <div>
                            <h1> USERS </h1>
                        </div>
                    </Tab>
                    <Tab className={lobbyStyles.tab}>
                        <h1> ACTIVE GAMES </h1>
                    </Tab>
                </TabList>
                <TabPanel>
                    <div className={lobbyStyles.tabPanelSort}>
                        <label  onClick={() => {this.setState({sortRank: !this.state.sortRank})}}>
                            <img src={this.state.sortRank ? trophygold : trophy} />
                            &nbsp;Sort
                        </label>
                    </div>
                    <div className={lobbyStyles.tabPanelFilter}><span><label><input defaultChecked={false} type="checkbox" onClick={this.filterOnline}/> Online only</label> </span></div>
                    {userDisplayList}
                </TabPanel>
                <TabPanel className={lobbyStyles.gameTabPanel}>
                    {gamesDisplayList}
                </TabPanel>
            </Tabs>;

        return (
            <div className={lobbyStyles.lobbyMain}>
                <div className={lobbyStyles.gameTitle}>
                    <img src={logo} />
                    <h1> The Royal Game of Ur </h1>
                </div>
                <div className={lobbyStyles.userStats}>
                    <div className={lobbyStyles.canvas}>
                        <canvas onClick={this.handleAvatarClick} id="myavatar" />
                        <img onClick={this.handleAvatarClick} src={pencil} />
                    </div>
                    <div className={lobbyStyles.userText}>
                        <Player name={name} />
                        {this.props.elorank ? <h2> Rating: {this.props.elorank} #{rank} </h2>: null}
                        {this.props.winLossRecord ? <h2> Wins: {this.props.winLossRecord.wins} Loses: {this.props.winLossRecord.loses} </h2>: null}
                    </div>
                </div>
                <button className={lobbyStyles.rules} onClick={this.handleToggleRules}> Rules </button>
                {(this.state.screenWidth >= 800) ? normalDisplay : tabbedDisplay}
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                {this.state.drawCanvas ? <DrawCanvas defaultData={userAvatar} edit={true} ref="sketcher" sketcherClassName={lobbyStyles.drawCanvas} className={lobbyStyles.mainDrawingCanvas} upload={this.upload} close={this.handleAvatarClick}/> : null}
                {this.state.rules ? <Rules toggleRules={this.handleToggleRules} /> : null}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    id: state.lobby.id,
    listOfUsers: state.lobby.listOfUsers,
    challenging: state.lobby.challenging,
    challengers: state.lobby.challengers,
    listOfActiveGames: state.lobby.listOfActiveGames,
    messages: state.lobby.messages,
    winLossRecord: state.lobby.winLossRecord,
    elorank: state.lobby.elorank
});

export default connect(
    mapStateToProps
)(Lobby);
