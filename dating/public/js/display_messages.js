class Message{
    constroctor(name, messages){
        this.name = name;
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
                    users_sent_message.push(response.messages[i].fromUserId.username);
                }
                var uniqe_contacts = findUniqeElements(users_sent_message);
                let contactList = document.getElementById('contact_list');
                for(let j = 0; j < uniqe_contacts.length; j++){
                    let newContact = document.createElement('li');
                    let newLink = document.createElement('a');
                    newLink.setAttribute('href', '');
                    let text = document.createTextNode(uniqe_contacts[j]);
                    newContact.appendChild(text);
                    newLink.appendChild(newContact);
                    contactList.appendChild(newLink);
                    newContact.addEventListener('click', function(e){
                        e.preventDefault();
                        displayMessages(response.messages, uniqe_contacts[j])
                    } , false);
                }

            } else {

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

function displayMessages(messages, username){
    let message_list = document.getElementById('message_list');
    message_list.innerHTML = "";
    for(let i = 0; i < messages.length; i++){
        if(messages[i].fromUserId.username === username || messages[i].toUserId.username === username){
            let newMessage = document.createElement('li');
            let text = document.createTextNode(messages[i].message);
            newMessage.appendChild(text);
            message_list.appendChild(newMessage);
            let line = document.createElement('hr');
            message_list.appendChild(line);
        }
    }
};