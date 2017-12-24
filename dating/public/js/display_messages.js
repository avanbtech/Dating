onload = function(){
    let serverURL = '/users/messages/get';

    $.ajax({
        url: serverURL,
        data: JSON.stringify({
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.success) {
                let contactList = document.getElementById('contact_list');
                for(let i = 0; i < response.users.length; i++){
                    let newContact = document.createElement('li');
                    let newLink = document.createElement('a');
                    newLink.setAttribute('href', '');
                    let text = document.createTextNode(response.users[i].fromUserId.username);
                    newContact.appendChild(text);
                    newLink.appendChild(newContact);
                    contactList.appendChild(newLink);
                }

            } else {

            }
        }
    })
};