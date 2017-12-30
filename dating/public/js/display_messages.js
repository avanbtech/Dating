class Conversation{
    constructor(username, messages){
        this.username = username;
        this.messages = messages;
    }
}

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
    for(let i = 0; i < conversations.length; i++){
        let newLink = document.createElement('a');
        newLink.setAttribute('href', '');
        let newContact = document.createElement('div');
        newContact.className += 'row';
        newLink.appendChild(newContact);
        contactList.appendChild(newLink);

        let image_column = document.createElement('div');
        image_column.className += 'col-sm-4';
        newContact.appendChild(image_column);
        let newContact_image = document.createElement('img');

        // Add user picture
        let user_image;
        if(conversations[i].username === conversations[i].messages[0].fromUserId.username ){
            user_image = conversations[i].messages[0].fromUserId.image;
        }
        else{
            user_image = conversations[i].messages[0].toUserId.image;
        }
        let image_src = user_image;
        newContact_image.setAttribute('src', image_src);
        newContact_image.className += 'profile_image';
        image_column.appendChild(newContact_image);

        let contact_column = document.createElement('div');
        contact_column.className += 'col-sm-8';
        newContact.appendChild(contact_column);

        let contact_name = document.createElement('p');

        let text = document.createTextNode(conversations[i].username);

        contact_name.appendChild(text);
        contact_column.appendChild(contact_name);




        // let image_src = user_image;
        // let newContact_image = document.createElement('image');
        // newContact_image.setAttribute('src', image_src);
        // newContact_image.className += 'contact_image';
        // newLink.appendChild(newContact_image);
        //

        //
        // newContact_image.parentNode.insertBefore(text, newContact_image.nextSibling);





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

    let message_list = document.getElementById('message_list');
    message_list.innerHTML = "";
    for(let i = 0; i < conversation.messages.length; i++) {
        let newMessage = document.createElement('div');
        let text = document.createTextNode(conversation.messages[i].message);
        newMessage.appendChild(text);
        if(conversation.username === conversation.messages[i].fromUserId.username){
            newMessage.className += "received";
            // Fill hidden field to save username
            let userId = document.getElementById('userId_hidden');
            userId.value = conversation.messages[i].fromUserId._id;
        }
        else{
            newMessage.className += "sent";
        }
        message_list.appendChild(newMessage);
        let line = document.createElement('hr');
        message_list.appendChild(line);
    }
};