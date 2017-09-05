var sinon = require('sinon');
var mockery = require('mockery');

describe('Cloak server tests', function() {
    let cloakConfig;
    const playerPath = [
        14, 17, 20, 23,
        22, 19, 16, 13,
        10, 7,  4,  1,
        2,  5,  8
    ];
    const opponentPath = [
        12, 15, 18, 21,
        22, 19, 16, 13,
        10, 7,  4,  1,
        0, 3,   6
    ];

    beforeEach(() => {
        cloak = jasmine.createSpyObj('cloak', ['message', 'run', 'configure', 'getLobby', 'getUser', 'createRoom', 'messageAll', 'getUsers', 'getRooms', 'getRoom']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'addMember', 'newMember', 'memberLeaves', 'isLobby']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message', 'connected']);
        room = jasmine.createSpyObj('room', ['removeMember', 'addMember', 'messageMembers', 'getMembers', 'isLobby']);
    });

    beforeEach(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    beforeEach(() => {
        cloak.getLobby.and.returnValue(lobby);
        cloak.configure.and.callFake(_config_ => {
            cloakConfig = _config_;
        });

        mockery.registerMock('cloak', cloak);
    });

    beforeEach(() => {
        require('./cloak-server')({});
    });

    afterEach(() => {
        mockery.deregisterAll();
    });

    afterEach(() => {
        mockery.disable();
    });

    it('sending message should update members in room with the new message list', () => {
        let testUser = {
            name: 'Foo',
            id: '1',
            data: {
                avatar: null,
            },
            getRoom: () => {
                return lobby;
            },
            connected: () => {
                return true;
            }
        }
        lobby.data = {};
        lobby.isLobby.and.returnValue(true);
        lobby.getMembers.and.returnValue(testUser);
        cloak.getUsers.and.returnValue([testUser]);
        user.getRoom.and.returnValue(lobby);
        cloakConfig.messages.sendmessage('foo', testUser);
        expect(lobby.data.messages[0].message).toEqual('foo');
        expect(lobby.data.messages.length).toEqual(1);
        cloakConfig.messages.sendmessage('bar', testUser);
        expect(lobby.data.messages[1].message).toEqual('bar');
        expect(lobby.data.messages.length).toEqual(2);
    });
//
//     it('sending message should update members in room with the new message list', () => {
//         let testUser = {
//             id: '1',
//             data: {
//                 challenging: [],
//                 challengers: []
//             },
//             getRoom: () => {
//                 return lobby;
//             },
//             connected: () => {
//                 return true;
//             },
//             message: (a, b) => {}
//         }
//         let testUser2 = {
//             id: '2',
//             data: {
//                 challenging: [],
//                 challengers: []
//             },
//             getRoom: () => {
//                 return lobby;
//             },
//             connected: () => {
//                 return true;
//             },
//             message: (a, b) => {}
//         }
//         const users = [testUser, testUser2];
//         lobby.data = {};
//         lobby.isLobby.and.returnValue(true);
//         lobby.getMembers.and.returnValue(users);
//         cloak.getUsers.and.returnValue([]);
//         user.getRoom.and.returnValue(lobby);
//         cloak.getUser.and.returnValue(testUser2);
//         const getLobbyUserInfo = sinon.spy();
//         cloakConfig.messages.challengeplayer(['2', 7, false, false], testUser);
//         expect(testUser2.data.challengers).toEqual([{id: '1',numberOfPieces: 7, enablePowerUps: false, alternatePath: false}])
//     });
});
//
// // data: {
// //     challenging: [],
// //     challenger: [],
// //     avatar: null,
// //     rank: null,
// //     spectating: false,
// //     online: true,
// //     elorank: 1200,
// //     dbId: 'db1',
// //     inChallenge: false,
// //     isPlayer: false,
// //     winLossRecord: {
// //         wins: 0,
// //         loses: 0
// //     },
// //     powerUp: null,
// //     piecesTaken: 0,
// //     piecesLost: 0,
// //     squaresMoved: 0,
// //     turnsInEndRange: 0,
// //     piecesTaken: 0,
// //     piecesLost: 0,
// //     squaresMoved: 0,
// //     turnsTaken: 0,
// //     turnsInEndRange: 0,
// //     turnsLastInEndRange: 0,
// //     numberOfRolls: 0,
// //     totalTimeTaken: 0,
// //     powerUpsCollected: 0,
// //     powerUpsUsed: 0
// // },
