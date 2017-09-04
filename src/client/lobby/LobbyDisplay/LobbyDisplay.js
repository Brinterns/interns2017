import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import User from './User';
import ActiveGames from './activeGames/ActiveGames';
import displayStyles from './LobbyDisplay.css';
import trophy from '../../images/icons/trophy.png';
import trophygold from '../../images/icons/trophygold.png';

export class LobbyDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: 0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.challengeUser = this.challengeUser.bind(this);
        this.cancelChallenge = this.cancelChallenge.bind(this);
        this.challengeRespond = this.challengeRespond.bind(this);
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

    challengeUser(id, numberOfPieces, powerUps, alternatePath) {
        cloak.message('challengeplayer', [id, numberOfPieces, powerUps, alternatePath]);
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

    render() {
        const userDisplayList = (
            this.props.users.map((user, i) => {
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

        const usersPanel = (
            <div>
                <div className={displayStyles.tabPanelSort}>
                    <label  onClick={this.props.toggleSortRank}>
                        <img src={this.props.sortRank ? trophygold : trophy} />
                        &nbsp;Sort
                    </label>
                </div>
                <div className={displayStyles.tabPanelFilter}><span><label><input defaultChecked={false} type="checkbox" onClick={this.props.toggleFilterOnline}/> Online only</label> </span></div>
                {userDisplayList}
            </div>
        );
        const normalDisplay = (
            <div className={displayStyles.container}>
                <div className={displayStyles.tabList}>
                    <div className={displayStyles.tab}>
                        <div>
                            <h1> USERS </h1>
                        </div>
                    </div>
                    <div className={displayStyles.tab}>
                        <h1> ACTIVE GAMES </h1>
                    </div>
                </div>
                <div className={displayStyles.tabPanel}>
                    {usersPanel}
                </div>
                <div className={displayStyles.gameTabPanel}>
                    <ActiveGames tabbed={false} />
                </div>
            </div>
        );
        const tabbedDisplay = (
            <Tabs className={displayStyles.container} selectedTabClassName={displayStyles.selectedTab} selectedTabPanelClassName={displayStyles.tabPanel}>
                <TabList className={displayStyles.tabList}>
                    <Tab className={displayStyles.tab}>
                        <div>
                            <h1> USERS </h1>
                        </div>
                    </Tab>
                    <Tab className={displayStyles.tab}>
                        <h1> ACTIVE GAMES </h1>
                    </Tab>
                </TabList>
                <TabPanel>
                    {usersPanel}
                </TabPanel>
                <TabPanel className={displayStyles.gameTabPanel}>
                    <ActiveGames tabbed={true} />
                </TabPanel>
            </Tabs>
        );

        return (
            <div>
                {(this.state.screenWidth >= 800) ? normalDisplay : tabbedDisplay}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    challenging: state.lobby.challenging,
    challengers: state.lobby.challengers
});

export default connect(
    mapStateToProps
)(LobbyDisplay);