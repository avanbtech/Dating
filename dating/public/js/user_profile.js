onload = function(){
    let messageBtn = document.getElementById('message');
    messageBtn.onclick = sendMessage;
    let label_message = document.getElementById('error_display');
    label_message.style.display = 'none';

    function sendMessage(){
        let serverURL = '/users/message/add';
        let message_element = document.getElementById('message_area');
        let pathname = window.location.pathname.split('/');
        let date = new Date();
        console.log(date);
        $.ajax({
            url: serverURL,
            method: 'POST',
            data: JSON.stringify({
            toUserId: pathname[pathname.length - 1],
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
            }
        })
    }
};