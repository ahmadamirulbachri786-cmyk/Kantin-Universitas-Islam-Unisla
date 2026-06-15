/**
 * Kantin Unisla - Shared Database & Logic Engine
 * Memanfaatkan localStorage untuk simulasi database real-time antar tab
 */

const DB_KEYS = {
    MERCHANTS: 'unisla_kantin_merchants',
    MENUS: 'unisla_kantin_menus',
    ORDERS: 'unisla_kantin_orders',
    TRANSACTIONS: 'unisla_kantin_transactions',
    ADMIN: 'unisla_kantin_admin_session',
    ACTIVE_MERCHANT: 'unisla_kantin_merchant_session'
};

// --- DATA AWAL (SEED) ---
const defaultMerchants = [
    {
        id: 'merchant-1', nama: 'Warung Bu Siti', deskripsi: 'Masakan khas Nusantara yang kaya bumbu dan pedas.',
        email: 'busiti@unisla.ac.id', password: 'password123', kontak: '081234567890', aktif: true, logo: 'nasi_goreng'
    },
    {
        id: 'merchant-2', nama: 'Kantin Barokah', deskripsi: 'Sajian tradisional Jawa yang nikmat, higienis.',
        email: 'barokah@unisla.ac.id', password: 'password123', kontak: '081298765432', aktif: true, logo: 'rawon'
    },
    {
        id: 'merchant-3', nama: 'Dapur Segar & Cemilan', deskripsi: 'Aneka minuman dingin menyegarkan dan cemilan manis gurih.',
        email: 'dapursegar@unisla.ac.id', password: 'password123', kontak: '085711223344', aktif: true, logo: 'es_teh'
    }
];

const defaultMenus = [
    { id: 'menu-101', merchantId: 'merchant-1', nama: 'Nasi Goreng Spesial', deskripsi: 'Nasi goreng bumbu cabai pilihan + telur.', kategori: 'Makanan', harga: 15000, stok: true, iconKey: 'nasi_goreng' },
    { id: 'menu-102', merchantId: 'merchant-1', nama: 'Mie Goreng Telur', deskripsi: 'Mie goreng instan dengan sayuran segar.', kategori: 'Makanan', harga: 12000, stok: true, iconKey: 'mie' },
    { id: 'menu-201', merchantId: 'merchant-2', nama: 'Rawon Daging', deskripsi: 'Sup daging kuah hitam khas Jawa Timur.', kategori: 'Makanan', harga: 18000, stok: true, iconKey: 'rawon' },
    { id: 'menu-202', merchantId: 'merchant-2', nama: 'Bakso Super', deskripsi: 'Bakso daging sapi halus dan kasar.', kategori: 'Makanan', harga: 14000, stok: false, iconKey: 'bakso' },
    { id: 'menu-301', merchantId: 'merchant-3', nama: 'Es Teh Manis', deskripsi: 'Teh melati seduh segar dengan gula asli.', kategori: 'Minuman', harga: 4000, stok: true, iconKey: 'es_teh' },
    { id: 'menu-302', merchantId: 'merchant-3', nama: 'Es Jeruk Peras', deskripsi: 'Jeruk peras murni tinggi vitamin C.', kategori: 'Minuman', harga: 5000, stok: true, iconKey: 'es_jeruk' },
    { id: 'menu-303', merchantId: 'merchant-3', nama: 'Pisang Goreng Coklat', deskripsi: 'Pisang kepok goreng dengan meses coklat.', kategori: 'Cemilan', harga: 8000, stok: true, iconKey: 'pisang' }
];

const FOOD_ICONS = {
    nasi_goreng: `<svg viewBox="0 0 100 100" class="food-svg"><circle cx="50" cy="55" r="35" fill="#e57373"/><circle cx="50" cy="55" r="30" fill="#ffb74d"/><path d="M25 75 Q50 90 75 75" stroke="#795548" stroke-width="6" fill="none"/></svg>`,
    mie: `<svg viewBox="0 0 100 100" class="food-svg"><circle cx="50" cy="55" r="35" fill="#ffd54f"/><path d="M30 45 Q40 30 50 45 T70 45" stroke="#ffb74d" stroke-width="4" fill="none"/><path d="M20 55 Q50 85 80 55" stroke="#b0bec5" stroke-width="8" fill="none"/></svg>`,
    rawon: `<svg viewBox="0 0 100 100" class="food-svg"><circle cx="50" cy="55" r="35" fill="#3e2723"/><ellipse cx="50" cy="55" rx="28" ry="20" fill="#211512"/><path d="M20 55 Q50 85 80 55" stroke="#78909c" stroke-width="8" fill="none"/></svg>`,
    bakso: `<svg viewBox="0 0 100 100" class="food-svg"><circle cx="50" cy="55" r="35" fill="#cfd8dc"/><circle cx="40" cy="50" r="10" fill="#8d6e63"/><circle cx="60" cy="48" r="8" fill="#8d6e63"/><path d="M20 55 Q50 85 80 55" stroke="#90a4ae" stroke-width="8" fill="none"/></svg>`,
    es_teh: `<svg viewBox="0 0 100 100" class="food-svg"><path d="M35 25 L40 85 Q40 88 45 88 L55 88 Q60 88 65 85 L70 25 Z" fill="#ffe082" stroke="#e0e0e0" stroke-width="3"/><path d="M37 45 L41 84 Q42 86 45 86 L55 86 Q58 86 59 84 L63 45 Z" fill="#b3390f"/></svg>`,
    es_jeruk: `<svg viewBox="0 0 100 100" class="food-svg"><path d="M35 25 L40 85 Q40 88 45 88 L55 88 Q60 88 65 85 L70 25 Z" fill="#ffe082" stroke="#e0e0e0" stroke-width="3"/><path d="M37 45 L41 84 Q42 86 45 86 L55 86 Q58 86 59 84 L63 45 Z" fill="#ffa726"/><circle cx="50" cy="40" r="12" fill="#ffb74d"/></svg>`,
    pisang: `<svg viewBox="0 0 100 100" class="food-svg"><path d="M25 45 Q40 30 65 45 Q50 65 25 45" fill="#ffd54f" stroke="#fbc02d" stroke-width="2"/><path d="M30 55 Q45 40 70 55 Q55 75 30 55" fill="#ffe082" stroke="#fbc02d" stroke-width="2"/></svg>`,
    snack: `<svg viewBox="0 0 100 100" class="food-svg"><rect x="30" y="35" width="40" height="45" rx="5" fill="#ff7043"/><path d="M30 45 L70 45 L65 75 L35 75 Z" fill="#f4511e"/><circle cx="50" cy="60" r="10" fill="#fff" opacity="0.8"/></svg>`
};

// --- CORE DATABASE ENGINE ---
const DB = {
    init() {
        if (!localStorage.getItem(DB_KEYS.MERCHANTS)) this.saveMerchants(defaultMerchants);
        if (!localStorage.getItem(DB_KEYS.MENUS)) this.saveMenus(defaultMenus);
        if (!localStorage.getItem(DB_KEYS.ORDERS)) this.saveOrders([]);
        if (!localStorage.getItem(DB_KEYS.TRANSACTIONS)) this.saveTransactions([]);
    },

    // Getters
    getMerchants: () => JSON.parse(localStorage.getItem(DB_KEYS.MERCHANTS) || '[]'),
    getMenus: () => JSON.parse(localStorage.getItem(DB_KEYS.MENUS) || '[]'),
    getOrders: () => JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]'),
    getTransactions: () => JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]'),

    // Setters
    saveMerchants(data) { localStorage.setItem(DB_KEYS.MERCHANTS, JSON.stringify(data)); this.notifyStorageChange(); },
    saveMenus(data) { localStorage.setItem(DB_KEYS.MENUS, JSON.stringify(data)); this.notifyStorageChange(); },
    saveOrders(data) { localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(data)); this.notifyStorageChange(); },
    saveTransactions(data) { localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(data)); this.notifyStorageChange(); },

    // Notifier for Real-time
    notifyStorageChange() {
        window.dispatchEvent(new Event('storage_updated'));
    },

    getFoodSvg(key) {
        return FOOD_ICONS[key] || FOOD_ICONS['snack'];
    },

    // --- PEMBELI / CUSTOMER API ---
    getMerchantById(id) {
        return this.getMerchants().find(m => m.id === id);
    },
    getMenusByMerchant(merchantId) {
        return this.getMenus().filter(m => m.merchantId === merchantId);
    },
    createOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
            status: 'pending', // pending -> processed -> ready -> completed
            ...orderData
        };
        orders.push(newOrder);
        this.saveOrders(orders);
        return newOrder;
    },

    // --- PENJUAL / MERCHANT API ---
    merchantLogin(email, password) {
        const merchant = this.getMerchants().find(m => m.email.toLowerCase() === email.toLowerCase() && m.password === password);
        if (merchant) {
            if (!merchant.aktif) return { success: false, message: 'Akun Anda dinonaktifkan oleh Admin.' };
            localStorage.setItem(DB_KEYS.ACTIVE_MERCHANT, JSON.stringify(merchant));
            return { success: true, merchant };
        }
        return { success: false, message: 'Email atau password salah.' };
    },
    merchantRegister(regData) {
        const merchants = this.getMerchants();
        if (merchants.some(m => m.email.toLowerCase() === regData.email.toLowerCase())) {
            return { success: false, message: 'Email sudah terdaftar!' };
        }
        const newMerchant = {
            id: 'merchant-' + Date.now(),
            aktif: true,
            logo: 'snack',
            ...regData
        };
        merchants.push(newMerchant);
        this.saveMerchants(merchants);
        localStorage.setItem(DB_KEYS.ACTIVE_MERCHANT, JSON.stringify(newMerchant));
        return { success: true };
    },
    getActiveMerchant() {
        return JSON.parse(localStorage.getItem(DB_KEYS.ACTIVE_MERCHANT) || 'null');
    },
    merchantLogout() {
        localStorage.removeItem(DB_KEYS.ACTIVE_MERCHANT);
    },
    getOrdersByMerchant(merchantId) {
        return this.getOrders().filter(o => o.merchantId === merchantId);
    },
    updateOrderStatus(orderId, newStatus) {
        const orders = this.getOrders();
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx].status = newStatus;
            
            // Auto create transaction if completed
            if (newStatus === 'completed') {
                const txs = this.getTransactions();
                txs.push({
                    id: 'tx-' + Date.now(),
                    orderId: orders[idx].id,
                    merchantId: orders[idx].merchantId,
                    amount: orders[idx].totalPrice,
                    paymentMethod: orders[idx].paymentMethod,
                    timestamp: new Date().toISOString()
                });
                this.saveTransactions(txs);
            }
            this.saveOrders(orders);
            return true;
        }
        return false;
    },

    // --- ADMIN API ---
    adminLogin(username, password) {
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem(DB_KEYS.ADMIN, 'true');
            return true;
        }
        return false;
    },
    isAdminLoggedIn() {
        return localStorage.getItem(DB_KEYS.ADMIN) === 'true';
    },
    adminLogout() {
        localStorage.removeItem(DB_KEYS.ADMIN);
    }
};

// Initialize DB on script load
DB.init();

// Helper: Format Rupiah
const formatRp = (num) => 'Rp ' + parseInt(num).toLocaleString('id-ID');

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}
