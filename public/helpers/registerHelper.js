const form = document.getElementById("registerForm");
const btn = form.querySelector("#register__btn");
const userName = form.querySelector("#name");
const userLogin = form.querySelector("#login");
const warning = form.querySelector(".registerError");
const password1 = form.querySelector("#password");
const password2 = form.querySelector("#passwordConfirm");

console.log(form);
form.addEventListener('submit', (e) => {
   
    if(password1.value !== password2.value){
        e.preventDefault()
        warning.innerText = `Passwords not match`
        warning.style.display = 'block'        
    }else if(password1.value.length < 5){
        e.preventDefault()
        warning.innerText = `Passwords is short`
        warning.style.display = 'block'  
    }
    else if (!password1.value || !password2.value || !userName.value || !userLogin.value){
        e.preventDefault()
        warning.innerText = `Some field is empty`
        warning.style.display = 'block'
    }
})

