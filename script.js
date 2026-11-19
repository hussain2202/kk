// بيانات منتجات SKIN KITCHEN
const catalog = {
    oily: {
        id: 'oily',
        name: 'سيروم الحبوب للبشرة الدهنية (30 مل)',
        price: 250
    },
    dull: {
        id: 'dull',
        name: 'سيروم النضارة فيتامين C (30 مل)',
        price: 250
    },
    sensitive: {
        id: 'sensitive',
        name: 'سيروم البشرة الحساسة بالشوفان (30 مل)',
        price: 250
    },
    hair: {
        id: 'hair',
        name: 'SS (30 مل)',
        price: 250
    },
    refill: {
        id: 'refill',
        name: 'إعادة ملء زجاجة Refill (30 مل)',
        price: 210
    }
};

let cart = JSON.parse(localStorage.getItem('skinKitchenCart')) || [];

// 1. البحث الفوري من الهيدر
function filterProducts() {
    const searchInput = document.getElementById('top-search-input');
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('no-search-results');
    let visibleCount = 0;

    cards.forEach(card => {
        const text = (card.innerText + ' ' + (card.dataset.search || '')).toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// 2. دالة اختبار البشرة والشعر وتوليد التركيبة المخصصة
function generateCustomSerum(event) {
    event.preventDefault();

    const skinType = document.getElementById('q-skin-type').value;
    const allergy = document.getElementById('q-allergy').value.trim();

    const resultBox = document.getElementById('quiz-result');
    const titleEl = document.getElementById('res-title');
    const ingEl = document.getElementById('res-ingredients');
    const allergyEl = document.getElementById('res-allergy-note');
    const addBtn = document.getElementById('res-add-btn');

    if (skinType === 'oily') {
        titleEl.textContent = 'تركيبتك: سيروم تنقية البشرة الدهنية وتقليل الحبوب';
        ingEl.textContent = 'المكونات الخام: زيت شجرة الشاي + نياسيناميد + جل صبار + ماء ورد + فيتامين E';
    } else if (skinType === 'dull') {
        titleEl.textContent = 'تركيبتك: سيروم الإشراقة وتوحيد اللون';
        ingEl.textContent = 'المكونات الخام: فيتامين C + هيالورونيك أسيد + ماء ورد + جلسرين + فيتامين E';
    } else if (skinType === 'sensitive') {
        titleEl.textContent = 'تركيبتك: سيروم التهدئة الفائقة للبشرة الحساسة';
        ingEl.textContent = 'المكونات الخام: ماء شوفان + بابونج + بانثينول + جل صبار + فيتامين E';
    } else {
        titleEl.textContent = 'تركيبتك: SS';
        ingEl.textContent = 'المكونات الخام: زيت إكليل الجبل + زيت أرجان + زيت جوجوبا + بيوتين + فيتامين E';
    }

    if (allergy && allergy !== 'لا يوجد') {
        allergyEl.textContent = `⚠️ ملاحظة التحضير: سيتم استبعاد (${allergy}) واستبداله ببديل آمن مع عمل اختبار حساسية قبل التسليم.`;
    } else {
        allergyEl.textContent = '✅ تركيبة آمنة 100% من مكونات طبيعية خام تُركّب أمامك.';
    }

    addBtn.onclick = function() {
        addToCart(skinType, `تركيبة مخصصة (${titleEl.textContent.replace('تركيبتك: ', '')})`);
    };

    resultBox.style.display = 'block';
}

// 3. دوال سلة التسوق وحساب التوصيل
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function addToCart(productId, customName = null) {
    const itemData = catalog[productId];
    if (!itemData) return;

    const finalName = customName || itemData.name;
    const existing = cart.find(item => item.name === finalName);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: finalName,
            price: itemData.price,
            quantity: 1
        });
    }

    saveAndRenderCart();
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.add('open');
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRenderCart();
}

function getDeliveryFee() {
    const select = document.getElementById('delivery-method');
    if (!select) return 0;
    if (select.value === 'home') return 30;
    if (select.value === 'governorates') return 50;
    return 0;
}

function saveAndRenderCart() {
    localStorage.setItem('skinKitchenCart', JSON.stringify(cart));

    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const deliveryCostEl = document.getElementById('delivery-cost');
    const totalEl = document.getElementById('cart-total');

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (countEl) countEl.textContent = totalCount;

    if (itemsEl) {
        itemsEl.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            itemsEl.innerHTML = '<p style="text-align:center; color:#777; margin-top:20px;">السلة فارغة حالياً 🌿</p>';
        } else {
            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div>
                        <strong style="font-size:0.88rem;">${item.name}</strong>
                        <div style="color:#4A6B53; font-weight:bold;">${item.quantity} × ${item.price} ج.م</div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">&times;</button>
                `;
                itemsEl.appendChild(div);
            });
        }

        const deliveryFee = cart.length > 0 ? getDeliveryFee() : 0;
        if (subtotalEl) subtotalEl.textContent = subtotal;
        if (deliveryCostEl) deliveryCostEl.textContent = deliveryFee;
        if (totalEl) totalEl.textContent = subtotal + deliveryFee;
    }
}

// 4. تحديث تفاصيل بوابة الدفع المختارة
function togglePaymentDetails() {
    const methodSelect = document.getElementById('payment-method');
    const detailsBox = document.getElementById('payment-details');
    if (!methodSelect || !detailsBox) return;

    const method = methodSelect.value;

    if (method === 'cod') {
        detailsBox.innerHTML = '<p>💵 سيتم تحصيل المبلغ نقداً عند استلام الطلب.</p>';
    } else if (method === 'visa') {
        detailsBox.innerHTML = `
            <input type="text" placeholder="رقم البطاقة (16 رقم)" maxlength="16">
            <div style="display:flex; gap:8px;">
                <input type="text" placeholder="MM/YY" maxlength="5">
                <input type="text" placeholder="CVV" maxlength="3">
            </div>
        `;
    } else if (method === 'cash') {
        detailsBox.innerHTML = `
            <p>📱 حوّلي المبلغ على رقم المحفظة: <strong>01000000000</strong></p>
            <input type="text" placeholder="اكتبي رقم المحفظة المحوّل منها للتأكيد">
        `;
    } else if (method === 'instapay') {
        detailsBox.innerHTML = `
            <p>⚡ عنوان الدفع (IPA): <strong>skinkitchen@instapay</strong></p>
            <input type="text" placeholder="اكتبي حساب إنستا باي الخاص بكِ">
        `;
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة! اختاري سيروم أولاً.');
        return;
    }

    const deliverySelect = document.getElementById('delivery-method');
    const deliveryName = deliverySelect ? deliverySelect.options[deliverySelect.selectedIndex].text : 'توصيل';

    const methodSelect = document.getElementById('payment-method');
    const methodName = methodSelect ? methodSelect.options[methodSelect.selectedIndex].text : 'دفع عند الاستلام';

    const totalEl = document.getElementById('cart-total');
    const totalAmount = totalEl ? totalEl.textContent : '0';

    alert(`تم تأكيد طلبك بنجاح في SKIN KITCHEN 🌿!\nالإجمالي: ${totalAmount} ج.م\nالتوصيل: ${deliveryName}\nطريقة الدفع: ${methodName}\nسيتم تحضير تركيبتك والتواصل معكِ فوراً.`);

    cart = [];
    saveAndRenderCart();
    toggleCart();
}

// 5. دالة إضافة التقييمات ونشرها فوراً
function handleFeedbackSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('fb-name').value;
    const rating = Number(document.getElementById('fb-rating').value);
    const comment = document.getElementById('fb-comment').value;

    const stars = '⭐'.repeat(rating);
    const reviewsGrid = document.getElementById('reviews-grid');

    if (reviewsGrid) {
        const newCard = document.createElement('div');
        newCard.className = 'review-card';
        newCard.innerHTML = `
            <div class="review-top">
                <strong>${name}</strong>
                <span>${stars}</span>
            </div>
            <p>"${comment}"</p>
            <span class="review-date">الآن</span>
        `;
        reviewsGrid.prepend(newCard);
    }

    const modal = document.getElementById('feedback-modal');
    if (modal) modal.style.display = 'none';
    event.target.reset();
}

// 6. نظام الرد التلقائي (Auto-Reply)
function toggleAutoReply() {
    const widget = document.getElementById('auto-reply-widget');
    if (widget) {
        widget.classList.toggle('open');
    }
}

function getAutoReplyAnswer(questionText) {
    const q = questionText.toLowerCase();

    if (q.includes('سعر') || q.includes('اسعار') || q.includes('بكام') || q.includes('refill') || q.includes('ملء')) {
        return 'سعر أي سيروم (30 مل) هو 250 ج.م، وإعادة الملء (Refill) بـ 210 ج.م فقط بنظام Zero Waste ♻️.';
    }
    if (q.includes('توصيل') || q.includes('شحن') || q.includes('استلام') || q.includes('محافظات')) {
        return 'متاح توصيل للمنزل (30 ج.م)، شحن للمحافظات (50 ج.م)، أو استلام مجاني من SKIN KITCHEN Bar 🚚🌿.';
    }
    if (q.includes('تركيب') || q.includes('اختبار') || q.includes('شعر') || q.includes('بشرة') || q.includes('ss')) {
        return 'بنجاوب على 3 أسئلة سريعة في مختبر التركيب، وبنركب السيروم طازجاً من 5 مكونات طبيعية خام مع مراعاة أي حساسية 🧪🌿.';
    }
    if (q.includes('دفع') || q.includes('فيزا') || q.includes('كاش') || q.includes('انستا') || q.includes('استلام')) {
        return 'متاح الدفع عند الاستلام، فيزا/ماستركارد، محفظة كاش (فودافون/اتصالات)، وإنستا باي 💳⚡.';
    }
    return 'شكراً لتواصلك مع SKIN KITCHEN 🌿! تقدري تجربي اختبار التركيب في الصفحة أو تضغطي على زرار واتساب للتواصل المباشر.';
}

function appendBotChat(userText, botText) {
    const box = document.getElementById('bot-messages');
    if (!box) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.textContent = userText;

    const botDiv = document.createElement('div');
    botDiv.className = 'bot-msg';
    botDiv.textContent = botText;

    box.appendChild(userDiv);
    box.appendChild(botDiv);
    box.scrollTop = box.scrollHeight;
}

function sendQuickReply(topic) {
    const labelMap = {
        'الأسعار': 'عايزة أعرف الأسعار ونظام Refill',
        'التركيب': 'إزاي بيتم تركيب السيروم؟',
        'التوصيل': 'إيه طرق التوصيل والشحن؟',
        'الدفع': 'إيه طرق الدفع المتاحة؟'
    };
    const userMsg = labelMap[topic] || topic;
    appendBotChat(userMsg, getAutoReplyAnswer(topic));
}

function handleBotInput(event) {
    event.preventDefault();
    const input = document.getElementById('bot-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    appendBotChat(text, getAutoReplyAnswer(text));
    input.value = '';
}

// 7. النشرة البريدية
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('newsletter-email');
    const msg = document.getElementById('newsletter-msg');
    if (!input || !input.value.trim()) return;

    if (msg) {
        msg.textContent = `تم اشتراك (${input.value.trim()}) بنجاح في نشرة SKIN KITCHEN 🌿`;
    }
    input.value = '';
}

// 8. إظهار وإخفاء قسم من نحن عند الضغط عليه
function toggleAboutUs(event) {
    if (event) event.preventDefault();

    const section = document.getElementById('about-us');
    if (!section) return;

    section.classList.toggle('show-about');

    if (section.classList.contains('show-about')) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    saveAndRenderCart();
    togglePaymentDetails();
});