function validateEmail(){
    var mail=document.getElementById('loginEmail').value;
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(mail)) {
        document.getElementById('emailError').innerHTML = '';
    }else{
        document.getElementById('emailError').innerHTML = '请输入正确的邮箱格式';
    }
}
function validateKey() {
    var key = document.getElementById('loginKey').value;
    var filter = /[a-z0-9]{6,16}/;
    if (filter.test(key)) {
        document.getElementById('keyError').innerHTML = '';
    } else {
        document.getElementById('keyError').innerHTML = '请输入6-16位字符';
    }
}

