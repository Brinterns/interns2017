import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import User from './User';
import Player from './User/Player';
import lobbyStyles from './Lobby.css';
import ChatBox from '../Chat/ChatBox';
import Rules from '../rules/Rules';

import { RunCloakConfig } from '../services/cloak-service';

export class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: 0,
            rules: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onClick = this.onClick.bind(this);
        this.challengeUser = this.challengeUser.bind(this);
        this.cancelChallenge = this.cancelChallenge.bind(this);
        this.challengeRespond = this.challengeRespond.bind(this);
        this.handleToggleRules = this.handleToggleRules.bind(this);
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

    onClick(e) {
        if (!(this.props.challenger || this.props.challenging)) {
            cloak.message('userready', _);
        }
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
            cloak.message('getlobbyinfo', _);
        } else {
            this.reconnectWait();
        }
    }

    challengeUser(user) {
        if (!(this.props.challenger || this.props.challenging)) {
            cloak.message('challengeplayer', user.id);
        }
    }

    cancelChallenge() {
        cloak.message('cancelchallenge', _);
    }

    challengeRespond(accept) {
        cloak.message('challengerespond', accept);
    }

    handleToggleRules() {
        this.setState({
            rules: !this.state.rules
        });
    }

    render() {
        let otherUsers = [];
        let name = '';
        this.props.listOfUsers.forEach((user) => {
            if (this.props.id != user.id) {
                otherUsers.push(user);
                return;
            }
            name = user.name;
        });

        const userDisplayList = (
            otherUsers.map((user, i) => {
                const canChallenge = this.props.challenging || ((this.props.challenger === null) ? true : false);
                return <User key={i} user={user} canChallenge={canChallenge} challengeUser={this.challengeUser} />;
            })
        );
        const gamesDisplayList = (
            this.props.listOfActiveGames.map((gameName, i) => {
                return <div key={i} className={lobbyStyles.game}><h1>{gameName}</h1></div>;
            })
        );
        const buttonClass = this.props.ready ? lobbyStyles.unready : null;

        let challengedDiv = null;
        if (this.props.challenger) {
            const opponent = this.props.listOfUsers.filter(user => {
                return user.id === this.props.challenger;
            })[0];
            if (opponent) {
                challengedDiv =
                    <div className={lobbyStyles.challengeMenu}>
                        <h1> {opponent.name} has challenged you </h1>
                        <button className={lobbyStyles.acceptButton} onClick={() => {this.challengeRespond(true)}}> Accept </button>
                        <button className={lobbyStyles.declineButton} onClick={() => {this.challengeRespond(false)}}> Decline </button>
                    </div>;
            }
        }
        let challengingDiv = null;
        if (this.props.challenging) {
            challengingDiv =
                <div className={lobbyStyles.challengeMenu}>
                    <h1> Waiting for response... </h1>
                    <button className={lobbyStyles.cancelButton} onClick={this.cancelChallenge}> Cancel </button>
                </div>;
        }

        const normalDisplay =
            <div className={lobbyStyles.container}>
                <div className={lobbyStyles.tabList}>
                    <div className={lobbyStyles.tab}>
                        <div>
                            <h1> Lobby </h1>
                        </div>
                    </div>
                    <div className={lobbyStyles.tab}>
                        <h1> Active Games </h1>
                    </div>
                </div>
                <div className={lobbyStyles.tabPanel}>
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
                            <h1> Lobby </h1>
                        </div>
                    </Tab>
                    <Tab className={lobbyStyles.tab}>
                        <h1> Active Games </h1>
                    </Tab>
                </TabList>
                <TabPanel>
                    {userDisplayList}
                </TabPanel>
                <TabPanel className={lobbyStyles.gameTabPanel}>
                    {gamesDisplayList}
                </TabPanel>
            </Tabs>;

        return (
            <div className={lobbyStyles.lobbyMain}>
                <div className={lobbyStyles.userStats}>
                    <Player name={name} />
                    {this.props.elorank ? <h2> Rating: {this.props.elorank} </h2>: null}
                    {this.props.winLossRecord ? <h2> Wins: {this.props.winLossRecord.wins} Loses: {this.props.winLossRecord.loses} </h2>: null}
                </div>
                <button className={lobbyStyles.rules} onClick={this.handleToggleRules}> Rules </button>
                {(this.state.screenWidth >= 600) ? normalDisplay : tabbedDisplay}
                <ChatBox id={this.props.id} messages={this.props.messages}/>
                <div className={lobbyStyles.readyOptions}>
                    <button className={buttonClass} onClick={this.onClick}>{this.props.ready ? 'Unready' : 'Ready'}</button>
                </div>
                {this.state.rules ? <Rules toggleRules={this.handleToggleRules} /> : null}
                {challengingDiv}
                {challengedDiv}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    id: state.lobby.id,
    listOfUsers: state.lobby.listOfUsers,
    ready: state.lobby.ready,
    challenging: state.lobby.challenging,
    challenger: state.lobby.challenger,
    listOfActiveGames: state.lobby.listOfActiveGames,
    messages: state.lobby.messages,
    winLossRecord: state.lobby.winLossRecord,
    elorank: state.lobby.elorank
});

export default connect(
    mapStateToProps
)(Lobby);
