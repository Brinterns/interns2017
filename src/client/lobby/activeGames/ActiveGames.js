import React, { Component } from 'react';
import { connect } from 'react-redux';
import {emojify} from 'react-emojione';
import activeGames from './ActiveGames.css';
import Game from './Game';

export class ActiveGames extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const gamesDisplayList = (
            this.props.listOfActiveGames.map((game, i) => {
                return (
                    <Game game={game} key={i} />
                );
            })
        );
        return (
            <div>
                {(this.props.listOfActiveGames === []) ? null : gamesDisplayList}
            </div>
        );
    }

}

const mapStateToProps = state => ({
    listOfActiveGames: state.lobby.listOfActiveGames
});

export default connect(
    mapStateToProps
)(ActiveGames);
