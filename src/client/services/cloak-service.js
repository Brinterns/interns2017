cloak.configure({
    messages: {
        updateusers: (userInfo) => {
            console.log("WADWADAWD");
            // if (!this.props.id) {
            //     return;
            // }
            // const info = JSON.parse(userInfo);
            // const ready = info.filter((user) => {
            //     return user.id === this.props.id;
            // })[0].ready;
            // this.props.updateUsers(info, ready);
        },
        updaterooms: (roomNames) => {
            // this.props.updateRoomNames(roomNames);
        },
        userid: (id) => {
            // this.props.updateId(id);
        },
        joingame: (roomId) => {
            // browserHistory.push('/game/' + roomId);
        },
        updatemessages: (messages) => {
            // this.props.updateMessages(JSON.parse(messages));
        }
    }
});
