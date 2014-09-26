var password = document.getElementById("password");
var    strength = document.getElementById("strength");
    //submit = document.getElementById("submit");
    
alert('salut cest checkpassword');
alert(password.name);
    
function check_password() {
    var score = zxcvbn(password.value).score;
    if (score < 2) {
        strength.value = "weak";
        //submit.disabled = true;
    }
    if (score === 2) {
        strength.value = "so-so";
        //submit.disabled = false;
    }
    if (score > 2) {
        strength.value = "strong";
        //submit.disabled = false;
    }
};
