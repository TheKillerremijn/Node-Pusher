var full = '//'+location.hostname+(location.port ? ':'+location.port: '');
var websocket = new WebSocket(full+"/538");

var id=0;

websocket.onData = function(datastring){
    var data = JSON.parse(datastring);
    data.reactid = id;
    id++;
    console.log(data.message);
    var items = messageelement.state.messages;
    items.unshift(data);
    messageelement.setState({messages: items})
};

websocket.onStatusChange = function(status){
    console.log("Status Changed: " + status);
    statuselement.setState({clientstate: status});
};

var MessageList = React.createClass({
    getInitialState: function(){
        return {messages: []};
    },
    render: function(){
        var messages = this.state.messages;

        return (
            <div className="messages">
                {messages.map(function(message){
                    return <div key={message.reactid} className="message">
                        <div className="sender">{message.sent_by.phone}</div>
                        <div className="messagetext">{message.message}</div>
                    </div>
                })}
            </div>
        )
    }
});

var messageelement = ReactDOM.render(
    <MessageList />,
    document.getElementById('messages')
);

var Status = React.createClass({
    getInitialState: function(){
        return {clientstate: "disconnected"};
    },
    render: function(){
        return <div>Status: {this.state.clientstate}</div>
    }
});

var statuselement = ReactDOM.render(
    <Status />,
    document.getElementById('status')
);