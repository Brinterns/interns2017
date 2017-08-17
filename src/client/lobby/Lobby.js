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
import ActiveGames from './activeGames/ActiveGames';


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
                cloak.message('reconnectuser', [localStorage.getItem('userId'), localStorage.getItem('dbId')]);
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

    challengeUser(id, numberOfPieces) {
        cloak.message('challengeplayer', [id, numberOfPieces]);
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
        let users = [];
        let name = '';
        let myCanvas = null;
        let userAvatar = null;
        let rank = '';

        var sortedList = Object.assign([], this.props.listOfUsers);
        var sorted = false;
        if (this.state.sortRank) {
            sorted = true;
            sortedList.sort(function(a, b) {
                return a.rank - b.rank;
            });
        }
        sortedList.forEach(user => {
            if (user.id === this.props.id) {
                name = user.name;
                userAvatar = user.avatar;
                rank = user.rank;
                user.isMe = true;
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
                        }, 50);
                    }
                }
            } else {
                user.isMe = false;
            }
            if (!(this.state.filterOnline && !user.online) && (!user.isMe || sorted)) {
                users.push(user);
            }
        });

        const userDisplayList = (
            users.map((user, i) => {
                var challenging = null;
                var challenger = null;
                const challengingTemp = this.props.challenging.filter(function(challengingInfo) {
                    return challengingInfo.id === user.id;
                });
                if (challengingTemp) {
                    challenging = challengingTemp[0];
                }
                const challengerTemp = this.props.challengers.filter(function(challengerInfo) {
                    return challengerInfo.id === user.id;
                });
                if (challengerTemp) {
                    challenger = challengerTemp[0];
                }
                return <User index={i} key={i} user={user} challenging={challenging} challenger={challenger} challengeUser={this.challengeUser} cancelChallenge={this.cancelChallenge} challengeRespond={this.challengeRespond} />;
            })
        );

        const usersPanel =
            <div>
                <div className={lobbyStyles.tabPanelSort}>
                    <label  onClick={() => {this.setState({sortRank: !this.state.sortRank})}}>
                        <img src={this.state.sortRank ? trophygold : trophy} />
                        &nbsp;Sort
                    </label>
                </div>
                    <div className={lobbyStyles.tabPanelFilter}><span><label><input defaultChecked={false} type="checkbox" onClick={this.filterOnline}/> Online only</label> </span></div>
                    {userDisplayList}
            </div>;
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
                    {usersPanel}
                </div>
                <div className={lobbyStyles.gameTabPanel}>
                    <ActiveGames tabbed={false} />
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
                    {usersPanel}
                </TabPanel>
                <TabPanel className={lobbyStyles.gameTabPanel}>
                    <ActiveGames tabbed={true} />
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
    messages: state.lobby.messages,
    winLossRecord: state.lobby.winLossRecord,
    elorank: state.lobby.elorank
});

export default connect(
    mapStateToProps
)(Lobby);
