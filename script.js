const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const commentItems = document.querySelectorAll('#list-comment .item');
let currentIndex = 0;

// Hiển thị bình luận đầu tiên khi tải trang
function showCurrentComment() {
    commentItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Xử lý khi nhấn nút "Next"
next.addEventListener('click', function (event) {
    event.preventDefault();
    if (currentIndex < commentItems.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Quay lại bình luận đầu tiên
    }
    showCurrentComment();
});

// Xử lý khi nhấn nút "Prev"
prev.addEventListener('click', function (event) {
    event.preventDefault();
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = commentItems.length - 1; // Chuyển đến bình luận cuối cùng
    }
    showCurrentComment();
});

// Gọi hàm để hiển thị bình luận đầu tiên khi tải trang
showCurrentComment();

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('#menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, quantity: 1 });
    }
    saveCart();
    renderCart();
    alert(`${name} đã được thêm vào giỏ hàng!`);
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        saveCart();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('list-cart');
    const totalPriceEl = document.getElementById('total-price');
    const cartCountEl = document.getElementById('cart-count');
    cartList.innerHTML = '';

    let total = 0;
    let totalItems = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <span class="name">${item.name}</span>
            <span class="quantity">
                <input type="number" value="${item.quantity}" min="0" onchange="updateQuantity('${item.id}', this.value)">
            </span>
            <span class="price">${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
            <button class="remove" onclick="removeFromCart('${item.id}')">Xóa</button>
        `;
        cartList.appendChild(li);
    });

    totalPriceEl.textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
    cartCountEl.textContent = totalItems;
}

document.getElementById('checkout-btn').addEventListener('click', function () {
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
    } else {
        alert('Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ để xác nhận.');
        cart = [];
        saveCart();
        renderCart();
    }
});

document.addEventListener('DOMContentLoaded', renderCart);
function logout() {
    localStorage.removeItem('loggedInUser');
    alert('Đã đăng xuất!');
    window.location.href = 'DangNhap.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('login-link');
    const loginText = document.getElementById('login-text');
    const logoutLink = document.getElementById('logout-link');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser && loggedInUser.fullname) {
        loginText.textContent = loggedInUser.fullname;
        loginLink.href = '#'; // Có thể thay bằng trang hồ sơ người dùng
        logoutLink.style.display = 'block'; // Hiển thị nút đăng xuất
    } else {
        loginLink.href = 'DangNhap.html';
        logoutLink.style.display = 'none';
    }

    renderCart();
});

document.getElementById('search-input').addEventListener('keyup', function () {
    const keyword = this.value.toLowerCase();
    const allTabs = document.querySelectorAll('.tab-content');

    // Nếu không có từ khóa => reset về trạng thái ban đầu
    if (keyword === '') {
        allTabs.forEach(tab => {
            const products = tab.querySelectorAll('.item');
            tab.classList.remove('active');
            tab.style.display = 'none';
            products.forEach(product => {
                product.style.display = 'flex'; // Hiện lại toàn bộ
            });
        });

        // Hiện lại tab 1
        const tab1 = document.getElementById('tab-1');
        tab1.classList.add('active');
        tab1.style.display = 'flex';

        // Cập nhật nút phân trang
        document.querySelectorAll('.list-page .item').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('btn-1').classList.add('active');
        return;
    }

    // Có từ khóa => lọc sản phẩm
    allTabs.forEach(tab => {
        const products = tab.querySelectorAll('.item');
        let hasVisibleProduct = false;

        products.forEach(product => {
            const name = product.querySelector('.name').textContent.toLowerCase();
            const desc = product.querySelector('.desc').textContent.toLowerCase();

            if (name.includes(keyword) || desc.includes(keyword)) {
                product.style.display = 'flex';
                hasVisibleProduct = true;
            } else {
                product.style.display = 'none';
            }
        });

        if (hasVisibleProduct) {
            tab.classList.add('active');
            tab.style.display = 'flex';
        } else {
            tab.classList.remove('active');
            tab.style.display = 'none';
        }
    });
});