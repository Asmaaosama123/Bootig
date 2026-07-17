import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Header
    'search.placeholder': 'Search Wetruss.com',

    // Categories
    'category.all': 'ALL',
    'category.woman': 'WOMAN',
    'category.man': 'MAN',
    'category.kids': 'KIDS',
    'category.beauty': 'BEAUTY',
    'category.electronics': 'ELECTRONICS',

    // Product sections
    'section.bestSellers': 'Best Sellers',
    'section.discounts': '10% - 50% OFF',
    'section.newProducts': 'New Products',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.addToCart': 'Add to Cart',

    // Profile
    'profile.title': 'PROFILE',
    'profile.userName': 'USER NAME',
    'profile.editProfile': 'EDIT PROFILE',
    'profile.myStore': 'MY STORE',
    'profile.myOrders': 'MY ORDERS',
    'profile.myFavorites': 'MY FAVORITES',
    'profile.language': 'LANGUAGE',
    'profile.callUs': 'CALL US',
    'profile.logout': 'LOGOUT',
    'profile.version': 'VERSION 0.0.001',

    // Store
    'store.myStore': 'My Store',
    'store.totalProducts': 'Total Products',
    'store.total': 'Total',
    'store.activeProducts': 'Active Products',
    'store.active': 'Active',
    'store.activeOffers': 'Active Offers',
    'store.offers': 'Offers',
    'store.lowStock': 'Low Stock',
    'store.addProduct': 'Add Product',
    'store.addNew': 'Add New',
    'store.products': 'Products',
    'store.productName': 'Product Name',
    'store.price': 'Price (MRU)',
    'store.category': 'Category',
    'store.quantity': 'Quantity',
    'store.productImage': 'Product Image',
    'store.description': 'Description (Optional)',
    'store.uploadImage': 'Upload product image',
    'store.chooseImage': 'Choose Image',
    'store.changeImage': 'Change Image',
    'store.status': 'Status',
    'store.stock': 'Stock',
    'store.viewStore': 'View Store',
    'store.offerType': 'Offer Type',
    'store.percentage': 'Percentage',
    'store.fixed': 'Fixed',
    'store.value': 'Value',
    'store.startDate': 'Start Date',
    'store.endDate': 'End Date',
    'store.addOffer': 'Add Offer',
    'store.selectProduct': 'Select Product',
    'store.noProducts': 'No products yet',
    'store.noProductsDesc': 'Start by adding your first products to sell.',
    'store.noOffers': 'No active offers',
    'store.noOffersDesc': 'Create offers to attract more customers.',

    // Orders
    'orders.title': 'MY ORDERS',
    'orders.empty': 'No orders yet',
    'orders.emptyDesc': 'When you place orders, they\'ll appear here.',
    'orders.viewDetails': 'View Details',
    'orders.reorder': 'Reorder',
    'orders.cancelOrder': 'Cancel Order',
    'orders.total': 'Total',
    'orders.placedOn': 'Placed on',

    // Favorites
    'favorites.title': 'MY FAVORITES',
    'favorites.empty': 'No favorites yet',
    'favorites.emptyDesc': 'Items you favorite will appear here.',
    'favorites.clearAll': 'Clear All Favorites',

    // Language Selection
    'language.title': 'Select Language',
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',

    // Common
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.viewAll': 'View All',
  },
  ar: {
    // Header
    'search.placeholder': 'البحث في Wetruss.com',

    // Categories
    'category.all': 'الكل',
    'category.woman': 'نساء',
    'category.man': 'رجال',
    'category.kids': 'أطفال',
    'category.beauty': 'جمال',
    'category.electronics': 'إلكترونيات',

    // Product sections
    'section.bestSellers': 'الأكثر مبيعاً',
    'section.discounts': 'خصم 10% - 50%',
    'section.newProducts': 'منتجات جديدة',

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'الدفع',
    'cart.addToCart': 'أضف للسلة',

    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.userName': 'اسم المستخدم',
    'profile.editProfile': 'تعديل الملف الشخصي',
    'profile.myStore': 'متجري',
    'profile.myOrders': 'طلباتي',
    'profile.myFavorites': 'المفضلة',
    'profile.language': 'اللغة',
    'profile.callUs': 'اتصل بنا',
    'profile.logout': 'تسجيل الخروج',
    'profile.version': 'الإصدار 0.0.001',

    // Store
    'store.myStore': 'متجري',
    'store.totalProducts': 'إجمالي المنتجات',
    'store.total': 'الإجمالي',
    'store.activeProducts': 'المنتجات النشطة',
    'store.active': 'نشط',
    'store.activeOffers': 'العروض النشطة',
    'store.offers': 'العروض',
    'store.lowStock': 'مخزون منخفض',
    'store.addProduct': 'إضافة منتج',
    'store.addNew': 'إضافة جديد',
    'store.products': 'المنتجات',
    'store.productName': 'اسم المنتج',
    'store.price': 'السعر (أوقية)',
    'store.category': 'الفئة',
    'store.quantity': 'الكمية',
    'store.productImage': 'صورة المنتج',
    'store.description': 'الوصف (اختياري)',
    'store.uploadImage': 'رفع صورة المنتج',
    'store.chooseImage': 'اختر صورة',
    'store.changeImage': 'تغيير الصورة',
    'store.status': 'الحالة',
    'store.stock': 'المخزون',
    'store.viewStore': 'عرض المتجر',
    'store.offerType': 'نوع العرض',
    'store.percentage': 'نسبة مئوية',
    'store.fixed': 'ثابت',
    'store.value': 'القيمة',
    'store.startDate': 'تاريخ البدء',
    'store.endDate': 'تاريخ الانتهاء',
    'store.addOffer': 'إضافة عرض',
    'store.selectProduct': 'اختر المنتج',
    'store.noProducts': 'لا توجد منتجات بعد',
    'store.noProductsDesc': 'ابدأ بإضافة منتجاتك الأولى للبيع.',
    'store.noOffers': 'لا توجد عروض نشطة',
    'store.noOffersDesc': 'أنشئ عروضًا لجذب المزيد من العملاء.',

    // Orders
    'orders.title': 'طلباتي',
    'orders.empty': 'لا توجد طلبات بعد',
    'orders.emptyDesc': 'عندما تقوم بطلبات، ستظهر هنا.',
    'orders.viewDetails': 'عرض التفاصيل',
    'orders.reorder': 'إعادة الطلب',
    'orders.cancelOrder': 'إلغاء الطلب',
    'orders.total': 'المجموع',
    'orders.placedOn': 'تم الطلب في',

    // Favorites
    'favorites.title': 'المفضلة',
    'favorites.empty': 'لا توجد مفضلة بعد',
    'favorites.emptyDesc': 'العناصر التي تضعها في المفضلة ستظهر هنا.',
    'favorites.clearAll': 'مسح جميع المفضلة',

    // Language Selection
    'language.title': 'اختر اللغة',
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',

    // Common
    'common.back': 'رجوع',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.remove': 'إزالة',
    'common.close': 'إغلاق',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.viewAll': 'عرض الكل',
  },
  fr: {
    // Header
    'search.placeholder': 'Rechercher sur Wetruss.com',

    // Categories
    'category.all': 'TOUT',
    'category.woman': 'FEMME',
    'category.man': 'HOMME',
    'category.kids': 'ENFANTS',
    'category.beauty': 'BEAUTÉ',
    'category.electronics': 'ÉLECTRONIQUE',

    // Product sections
    'section.bestSellers': 'Meilleures Ventes',
    'section.discounts': '10% - 50% DE RÉDUCTION',
    'section.newProducts': 'Nouveaux Produits',

    // Cart
    'cart.title': 'Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.total': 'Total',
    'cart.checkout': 'Commander',
    'cart.addToCart': 'Ajouter au Panier',

    // Profile
    'profile.title': 'PROFIL',
    'profile.userName': 'NOM D\'UTILISATEUR',
    'profile.editProfile': 'MODIFIER LE PROFIL',
    'profile.myStore': 'MA BOUTIQUE',
    'profile.myOrders': 'MES COMMANDES',
    'profile.myFavorites': 'MES FAVORIS',
    'profile.language': 'LANGUE',
    'profile.callUs': 'NOUS APPELER',
    'profile.logout': 'DÉCONNEXION',
    'profile.version': 'VERSION 0.0.001',

    // Store
    'store.myStore': 'Ma Boutique',
    'store.totalProducts': 'Total Produits',
    'store.total': 'Total',
    'store.activeProducts': 'Produits Actifs',
    'store.active': 'Actif',
    'store.activeOffers': 'Offres Actives',
    'store.offers': 'Offres',
    'store.lowStock': 'Stock Faible',
    'store.addProduct': 'Ajouter Produit',
    'store.addNew': 'Ajouter Nouveau',
    'store.products': 'Produits',
    'store.productName': 'Nom du Produit',
    'store.price': 'Prix (MRU)',
    'store.category': 'Catégorie',
    'store.quantity': 'Quantité',
    'store.productImage': 'Image du Produit',
    'store.description': 'Description (Optionnel)',
    'store.uploadImage': 'Télécharger image du produit',
    'store.chooseImage': 'Choisir Image',
    'store.changeImage': 'Changer Image',
    'store.status': 'Statut',
    'store.stock': 'Stock',
    'store.viewStore': 'Voir Boutique',
    'store.offerType': 'Type d\'Offre',
    'store.percentage': 'Pourcentage',
    'store.fixed': 'Fixe',
    'store.value': 'Valeur',
    'store.startDate': 'Date de Début',
    'store.endDate': 'Date de Fin',
    'store.addOffer': 'Ajouter Offre',
    'store.selectProduct': 'Sélectionner Produit',
    'store.noProducts': 'Aucun produit encore',
    'store.noProductsDesc': 'Commencez par ajouter vos premiers produits à vendre.',
    'store.noOffers': 'Aucune offre active',
    'store.noOffersDesc': 'Créez des offres pour attirer plus de clients.',

    // Orders
    'orders.title': 'MES COMMANDES',
    'orders.empty': 'Aucune commande encore',
    'orders.emptyDesc': 'Quand vous passez des commandes, elles apparaîtront ici.',
    'orders.viewDetails': 'Voir Détails',
    'orders.reorder': 'Recommander',
    'orders.cancelOrder': 'Annuler Commande',
    'orders.total': 'Total',
    'orders.placedOn': 'Commandé le',

    // Favorites
    'favorites.title': 'MES FAVORIS',
    'favorites.empty': 'Aucun favori encore',
    'favorites.emptyDesc': 'Les articles que vous mettez en favoris apparaîtront ici.',
    'favorites.clearAll': 'Effacer Tous les Favoris',

    // Language Selection
    'language.title': 'Sélectionner la Langue',
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',

    // Common
    'common.back': 'Retour',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.remove': 'Retirer',
    'common.close': 'Fermer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.viewAll': 'Voir Tout',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};