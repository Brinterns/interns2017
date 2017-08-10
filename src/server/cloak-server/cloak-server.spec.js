let cloakConfig;
let mockery = require('mockery');

describe('Cloak server tests', function() {

    beforeEach(() => {
        cloak = jasmine.createSpyObj('cloak', ['message', 'run', 'configure', 'getLobby', 'getUser', 'createRoom', 'messageAll', 'getUsers', 'getRooms', 'getRoom']);
        db = jasmine.createSpyObj('db', ['getAllUsers']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'addMember', 'newMember', 'memberLeaves', 'isLobby']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message']);

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
        db.getAllUsers.and.returnValue([]);

        cloak.configure.and.callFake(_config_ => {
            cloakConfig = _config_;
        });

        mockery.registerMock('cloak', cloak);
        mockery.registerMock('db', db);
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

    it('on creating a new member, refreshLobby message sent with correct list of users', () => {
        let testUser = {
            name: 'Foo',
            id: '1',
            data: {
                challenging: [],
                challenger: [],
                avatar: null,
                rank: null,
                spectating: false,
                online: true,
                elorank: 1200,
                dbId: 'db1',
                inChallenge: false,
                isPlayer: false,
                winLossRecord: {
                    wins: 0,
                    loses: 0
                }
            },
            getRoom: () => {
                return lobby;
            }
        }

        lobby.data = {};
        lobby.isLobby.and.returnValue(true);
        lobby.getMembers.and.returnValue(testUser);
        cloak.getUsers.and.returnValue([testUser]);
        user.getRoom.and.returnValue(lobby);
        cloakConfig.lobby.newMember();
        // console.log('db = ' + db.getAllUsers);
        expect(lobby.messageMembers).toHaveBeenCalledWith('updateusers', JSON.stringify([testUser]));
        // expect(lobby.messageMembers).toHaveBeenCalledWith('refreshLobby', users);
    });
});
