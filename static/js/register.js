// 声明一个变量用于存储生成的验证码
function changeImg(){
    // 验证码组成库
    var arrays=new Array(
        '1','2','3','4','5','6','7','8','9','0',
        'a','b','c','d','e','f','g','h','i','j',
        'k','l','m','n','o','p','q','r','s','t',
        'u','v','w','x','y','z',
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z'
    );
    // 重新初始化验证码
    code ='';
    // 随机从数组中获取四个元素组成验证码
    for(var i = 0; i<4; i++){
        // 随机获取一个数组的下标
        var r = parseInt(Math.random()*arrays.length);
        code += arrays[r];
    }
    // 验证码写入span区域
    document.getElementById('code').innerHTML = code;

}
function validateEmail(){
    var mail=document.getElementById('regEmail').value;
    console.log(mail)
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(mail)) {
        document.getElementById('emailError').innerHTML = '';
    }else{
        document.getElementById('emailError').innerHTML = '请输入正确的邮箱格式';
    }
}
//验证密码
function validateKey() {
    var key = document.getElementById('regKey').value;
    var filter = /^[a-zA-Z\d]{6,16}$/;
    if (filter.test(key)) {
        document.getElementById('keyError').innerHTML = '';
    } else {
        document.getElementById('keyError').innerHTML = '请输入6-16位字符';
    }
}

// 验证验证码
function validateCode(){
    var error;
    // 获取用户输入的验证码
    var codeInput = document.getElementById('codeInput').value;
    if(codeInput.toLowerCase() == code.toLowerCase()){
        document.getElementById('codeError').innerHTML=''
    }else{
        error = '验证码错误，重新输入';
        document.getElementById('codeError').innerHTML = error;
    }
}
function isAgree(){
    var ischeck=document.getElementById('agree');
    var isEmail=document.getElementById('emailError').innerHTML==='';
    var isCode=document.getElementById('codeError').innerHTML==='';
    if (!ischeck.checked){
        $('#emailSend').attr('disabled',true);
    }
    else{
        $('#emailSend').attr('disabled',false);
    }
}
//发送邮件

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

addLoadEvent(isAgree);