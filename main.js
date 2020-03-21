var divContainer = document.querySelector("#app");
var boxContainer = document.createElement("div");
var buttonElement = document.createElement("button");
var inputElement = document.createElement("input");

function SetBackGround() {
  divContainer.appendChild(boxContainer);
  document.body.style.backgroundImage = "url(./Images/Background.jpg)";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "bottom";
  boxContainer.setAttribute("class", "box");
  boxContainer.style.height = 100;
  boxContainer.style.backgroundColor = "#a7bdbd";
  boxContainer.style.display = "flex";
  boxContainer.style.justifyContent = "center";
  boxContainer.style.alignItems="center";
}

function SetButtonAndInput() {
  boxContainer.appendChild(inputElement);
  boxContainer.appendChild(buttonElement);
  var textButton = document.createTextNode("Procurar no GitHub");
  buttonElement.appendChild(textButton);
  buttonElement.onclick = ShowUserRequested;
}

function CreateUserShowField(user){
  var oldField = document.querySelector(".UserShow");
  if (oldField != null){
    oldField.remove();
  }
  var field = document.createElement("div");
  field.setAttribute('class', "UserShow");
  divContainer.appendChild(field);
  field.style.backgroundColor = "#a7bdbd";
  field.style.height = '50%';
  field.style.width = '80%';
  field.style.position = 'center';
  field.style.marginTop = '5%';
  field.style.marginLeft = '10%';
  field.style.display = 'flex';
  field.style.justifyContent = "center";
  field.style.alignItems="center";

  var userAvatar = document.createElement('img');
  field.appendChild(userAvatar);
  userAvatar.src = user.avatar_url;
  userAvatar.style.height = 'auto';
  userAvatar.style.width = 'auto';
  userAvatar.style.maxHeight = '70%';
  userAvatar.style.objectFit = 'contain';

  var descBox = document.createElement('div');
  var userName = document.createElement('h1');
  if (user.name != null) {
    var name = document.createTextNode(user.name);
  }
  else{
    var name = document.createTextNode("Usuario sem nome");
  }
  if (user.bio!= null){
    var bio = document.createTextNode(user.bio);
  }
  else{
    var bio = document.createTextNode("Usuario sem descricao");
  }
  var link = document.createElement('a');
  var linktext = document.createTextNode("Visite a pagina do usuario no Github!");
  link.appendChild(linktext);
  link.setAttribute('href', user.html_url);
  field.appendChild(descBox);
  descBox.style.display = "flex";
  descBox.style.flexDirection = "column";
  descBox.appendChild(userName);
  userName.appendChild(name);
  descBox.appendChild(bio);
  descBox.appendChild(link);
  descBox.style.paddingLeft = 50;

  var repBox = document.createElement('ul');
  field.appendChild(repBox);
  var carregandoLi = document.createElement('li');
  var carregandoText = document.createTextNode('Carregando repositorios...');
  carregandoLi.appendChild(carregandoText);
  repBox.appendChild(carregandoLi);
  RequestUserRepo(user.login, repBox);
}

function RequestUserRepo(user, list){
 axios.get("https://api.github.com/users/" + user + "/repos")
  .then(function(resolve){
    console.log(resolve);
    list.innerHTML = '';
    var reph1 = document.createElement('h1');
    var reph1Text = document.createTextNode("Repositorios:");
    reph1.appendChild(reph1Text);
    list.appendChild(reph1);
    for (var i = 0; i < 5; i++){
      if (i == resolve.data.length){
        return;
      }
      var linkRepo = document.createElement('a');
      linkRepo.setAttribute('href', resolve.data[i].html_url);
      var repo = document.createElement('li');
      repo.setAttribute('href', "www.google.com");
      var repoText = document.createTextNode(resolve.data[i].name);
      repo.appendChild(repoText);
      linkRepo.append(repo);
      list.appendChild(linkRepo);
    }
  })
  .catch(function(reject){
    console.warn(reject);
  });
}

function RequestUserFromAPI(){
  return new Promise(function(resolve, reject){
    var user = inputElement.value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/users/'+ user);
    xhr.send(null);

    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
        if (xhr.status === 200){
          resolve(JSON.parse(xhr.responseText));
        }else{
          reject('Erro na requisição');
        }
      }
    }
  });
}

function ShowUserRequested(){
  RequestUserFromAPI()
    .then(function(response){
      console.log(response);
      CreateUserShowField(response);
    })
    .catch(function(reject){
      console.warn(reject);
      alert("Usuario incorreto");
    });
}

SetBackGround();
SetButtonAndInput();