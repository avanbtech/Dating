onload = function(){
    let messageBtn = document.getElementById('message');
    messageBtn.onclick = sendMessage;
    let label_message = document.getElementById('error_display');
    label_message.style.display = 'none';

    function sendMessage(){
        let serverURL = '/users/message/add';
        let message_element = document.getElementById('message_area');
        let date = new Date();
        let clicked_user_id = document.getElementById('userId_hidden')
        console.log(date);
        //TODO: Replace user id with username using hidden field
        $.ajax({
            url: serverURL,
            method: 'POST',
            data: JSON.stringify({
            toUserId: clicked_user_id.value,
            message: message_element.value,
            sent_date: date
            }),
            contentType: 'application/json',
            success: function(response){
                if(response.success){
                    label_message.style.color = 'green';
                    label_message.innerHTML = 'Your message was sent successfully';

                }else{
                    label_message.style.color = 'red';
                    label_message.innerHTML = 'Your message was not sent';
                }
                label_message.style.display = 'block';
                if(document.getElementById('message_list')){
                    // Display message at the end of message list
                    let newMessage = document.createElement('div');
                    let text = document.createTextNode(response.newMessage.message);
                    newMessage.appendChild(text);
                    newMessage.className += "sent";
                    message_list.appendChild(newMessage);
                    let line = document.createElement('hr');
                    message_list.appendChild(line);
                    // Clear text area
                    let text_area = document.getElementById('message_area');
                    text_area.value = '';
                    // Hide message when user click on text area
                    text_area.addEventListener('click', function(){
                        label_message.style.display = 'none';
                    });
                }
            }
        })
    }
};