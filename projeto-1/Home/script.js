var newForm = document.getElementById("div-4");
newText.onclick = function (addNewInput) {
    newForm.style.display = "block";
    var button = document.getElementById("newText");
    button.style.display = "none";
};

const form = document.querySelector("#formNews");
form.addEventListener("submit", function(Event) {
    Event.preventDefault();
    const formData = new FormData(this);
    var nome = formData.get("name");
    var email = formData.get("email");
    var fone = formData.get("fone");
    var wp = formData.get("wp");
    alert("Tudo certo " + nome + "! Em breve você receberá uma mensagem no endereço de email " + email + "!");
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("fone").value = '';
    document.getElementById("wp").value = '';
    //email has
});

//function sendMessage


