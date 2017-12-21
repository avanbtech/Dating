onload = function(){
    var updateBtn = document.getElementById('update');
    updateBtn.onclick = updateUserProfile;

    function updateUserProfile(){
        let serverURL = '/users/profile/update';
        let firstName = document.getElementById('first_name');
        let lastName = document.getElementById('last_name');
        let email = document.getElementById('email');
        let dateOfBirth = document.getElementById('date_of_birth');

        $.ajax({
            url: serverURL,
            method: 'POST',
            data: JSON.stringify({
                first_name: firstName.value,
                last_name: lastName.value,
                email: email.value,
                date_of_birth: dateOfBirth.value
            }),
            contentType: 'application/json',
            success: function(response){
                if(response.succes){
                    req.flash('success_msg', 'Your information was updated successfully');
                    redirect('/users/profile/update');
                }else{

                }
            }
        })
    }
};