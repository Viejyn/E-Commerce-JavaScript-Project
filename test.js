
// fetch: api'ye http istek atmamızı sağlar.
// get: veri almaya yarar.
// post: sunucuya veri göndermeye yarar.
// put: sunucudaki bir veriyi güncellemeye yarar.
// delete: bir veriyi silmeye yarar.

// get örneği; yalnızca isteğimizi söylüyoruz
function getUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
      // gelen cevabın 2 anlamı var: 1- Olumlu olur, veri gelir. 
      .then((response) => response.json())
      .then((data) => renderUsers(data))
      // 2- Olumsuz olur ve hata mesajı gelir. 
      .catch((error) => console.log(error));
}

// fonksiyonu çağırıp isteği gerçekleştirme
getUsers();

function renderUsers(users) {
    users.forEach((user) => document.write(user.name + '<br>'));
}