class Conversation{
    constructor(username, messages){
        this.username = username;
        this.messages = messages;
    }
}

onload = function(){
    let serverURL = '/users/messages/get';

    $.ajax({
        url: serverURL,
        data: JSON.stringify({
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.success) {
                let users_sent_message = [];
                for (let i = 0; i < response.messages.length; i++){
                    if(response.messages[i].fromUserId.username !== response.logged_in_user) {
                        users_sent_message.push(response.messages[i].fromUserId.username);
                    }
                }
                var uniqe_contacts = findUniqeElements(users_sent_message);

                let conversation_objects = [];
                for(let j = 0; j < uniqe_contacts.length; j++){
                    let newConversation = new Conversation(uniqe_contacts[j], findMessages(response.messages, uniqe_contacts[j]));
                    conversation_objects.push(newConversation);
                }
                displayContacts(conversation_objects);
            }
            else {

            }
        }
    })

};

function findUniqeElements(array) {
    var arr = [];
    for(var i = 0; i < array.length; i++) {
        if(!arr.includes(array[i])) {
            arr.push(array[i]);
        }
    }
    return arr;
};

function displayContacts(conversations){
    let contactList = document.getElementById('contact_list');
    for(let i=0; i<conversations.length; i++){
        let newContact = document.createElement('li');
        let newLink = document.createElement('a');
        newLink.setAttribute('href', '');
        let text = document.createTextNode(conversations[i].username);
        newContact.appendChild(text);
        newLink.appendChild(newContact);
        contactList.appendChild(newLink);
        newContact.addEventListener('click', function(e){
            e.preventDefault();
            displayMessages(conversations[i])
        } , false);
    }
};

function findMessages(messages, username){
    let conversation = [];
    for(let i = 0; i < messages.length; i++) {
        if (messages[i].fromUserId.username === username || messages[i].toUserId.username === username) {
            conversation.push(messages[i]);
        }
    }
    return conversation;
};

function displayMessages(conversation){
    let message_list_received = document.getElementById('message_received');
    let message_list_sent = document.getElementById('message_sent');
    message_list_received.innerHTML = "";
    message_list_sent.innerHTML = "";
    for(let i = 0; i < conversation.messages.length; i++) {
        let newMessage = document.createElement('div');
        let text = document.createTextNode(conversation.messages[i].message);
        newMessage.appendChild(text);
        if(conversation.username === conversation.messages[i].fromUserId.username){
            message_list_received.appendChild(newMessage);
            let line = document.createElement('hr');
            message_list_received.appendChild(line);
        }
        else{
            message_list_sent.appendChild(newMessage);
            let line = document.createElement('hr');
            message_list_sent.appendChild(line);
        }
    }
};