// Html'den gelenler
const categoryList = document.querySelector('.categories');
const productsArea = document.querySelector('.products');
const basketBtn = document.querySelector('#basket');
const closeBtn = document.querySelector('#close');
const modal = document.querySelector('.modal-wrapper');
const basketList = document.querySelector('#list');
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector('#count');

// API İşlemleri

// html'in yüklenme anı
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();
});

// yaptığımız isteklerin tamamında bulunur:
const baseUrl = 'https://fakestoreapi.com';

/*
* Kategori bilgilerini alma
* 1- Api'ye istek at
* 2- Gelen veriyi işle
* 3- Gelen verileri kart şeklinde ekrana basacak fonksiyonu çalıştır.
* 4- Cevap hatalı olursa kullanıcıyı bilgilendir.
*/

function fetchCategories() {
    fetch(`${baseUrl}/products/categories`)
    // cevap olumlu gelirse çalışır
    .then((res) => res.json())
    // veri json formatına dönünce çalışır
    .then((data) => {
        renderCategories(data);
    })
    // cevapta hata varsa çalışır
    .catch((err) => console.log(err));
}

function fetchCategoryImage(category) {
    return fetch(`${baseUrl}/products/category/${category}`)
        .then((res) => res.json())
        .then((products) => (products.length > 0 ? products[0].image : null))
        .catch((err) => console.log(err));
}

async function renderCategories(categories) {
    for (const category of categories) {
        const imageUrl = await fetchCategoryImage(category);

        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-card');
        categoryDiv.innerHTML = `
            <img src="${imageUrl || 'https://via.placeholder.com/150?text=Default'}" alt="${category}" />
            <p>${category}</p>        
        `;
        categoryList.appendChild(categoryDiv);
    }
}

// Ürünler için istek at
async function fetchProducts() {
    // isteği atar
    try {        
        const res = await fetch(`${baseUrl}/products`);
        const data = await res.json();
        console.log(data);
        renderProducts(data.slice(0, 25));
    // hata olursa yakalar   
    } catch(err) {        
        console.log(err);
    }
}

// Ürünleri ekrana basar
function renderProducts(products) {
    // her bir ürün için kart html'i oluştur ve diziye aktar
    const productsHTML = products.map(
        (product) => `
        <div class="card">
                    <img src="${product.image}" alt="${product.title}"/>
                    <h4>${product.title}</h4>
                    <h4>${product.category}</h4>
                    <div class="action">
                        <span>${product.price} &#8378;</span>
                        <button onclick="addToBasket({id:${product.id},title:'${product.title}',price:${product.price},img:'${product.image}',amount:1})">Sepete Ekle</button>
                    </div>
        </div>    
    <!-- dizi şeklindeki veriyi, virgülleri kaldırarak stringe dönüştürür-->
    `).join(' ');

    // ürünler html'ini listeye gönder
    productsArea.innerHTML += productsHTML;
}

// Sepet Değişkenleri

let basket = [];
let total = 0;

//! Modal İşlemleri

basketBtn.addEventListener("click", () => {
    // sepeti açma
    modal.classList.add('active');
    // sepette ürünleri listeleme
    renderBasket();
});

closeBtn.addEventListener("click", () => {
    // sepeti kapatma
    modal.classList.remove('active');
});

//! Sepet İşlemleri

// Sepete ekleme işlemi
function addToBasket(product) {
    // ürün sepete daha önce eklendi mi?
    const found = basket.find((i) => i.id === product.id);
    
    if(found){
        // eleman sepette var > miktarı arttır
        found.amount ++;
    } else {
        // eleman sepette yok > sepete ekle
        basket.push(product);
    }
}

// Sepete elemanları listeleme
function renderBasket(){
    // kartları oluşturma
    const cardsHTML = basket
    .map(
        (product) => `
    <div class="item">
                    <img src="${product.img}" alt="${product.title}" class="basket-img"/>
                    <h3 class="title">${product.title}</h3>
                    <h4 class="price">${product.price} &#8378;</h4>
                    <p>Miktar: ${product.amount}</p>
                    <img onClick="deleteItem(${product.id})" id="delete" src="/images/e-trash.png"/>
                </div>    
    `)
    .join(' ');

    // hazırladığımız kartları HTML'e gönderme
    basketList.innerHTML = cardsHTML;

    // toplam değeri hesapla
    calculateTotal();
}

// Sepet Toplamı Ayarlama
function calculateTotal() {
    // Toplamı hesaplama
    const sum = basket.reduce((sum,i) => sum + (i.price * i.amount) ,0);

    // Ürün miktarını hesaplama
    const amount = basket.reduce((sum,i) => sum + i.amount ,0);

    // miktarı HTML'e gönderme
    totalCount.innerText = amount + ' ' + 'Ürün';

    // Toplam değeri HTML'e gönderme
    totalSpan.innerText = sum;
}

// Sepettem ürün silme
function deleteItem(deleteid) {
    // kaldırılacak ürün dışındaki bütün ürünleri al
    basket = basket.filter((i) => i.id !== deleteid);

    // listeyi güncelle
    renderBasket();

    // toplamı güncelle
    calculateTotal();
}
