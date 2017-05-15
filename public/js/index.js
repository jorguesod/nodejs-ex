var socket = io();

// sub for server file change
socket.on('refresh', function (data) {
    location.reload(true);
});

// sub for server data
socket.on('to_client', function(data){
    if(data && data.type == 'new_highscore_list'){
        
    }
    console.log(data);
});

// socket.emit send to server
socket.emit('to_server', { type: 'message', val: 'Hi I´m client' });