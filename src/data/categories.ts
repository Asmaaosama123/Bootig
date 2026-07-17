export interface CategoryStructure {
  [key: string]: string[] | {
    [subcategory: string]: string[];
  };
}

const staticCategoryStructure: CategoryStructure = {
  "WOMAN": {
    "DRESSES": ["SUMMER DRESSES", "EVENING DRESSES", "CASUAL DRESSES", "PARTY DRESSES"],
    "TOPS": ["T-SHIRTS", "BLOUSES", "SWEATERS", "TANK TOPS"],
    "SHOES": ["HEELS", "SNEAKERS", "BOOTS", "SANDALS"],
    "ACCESSORIES": ["BAGS", "JEWELRY", "SCARVES", "SUNGLASSES"]
  },
  "MEN": {
    "SHIRTS": ["DRESS SHIRTS", "CASUAL SHIRTS", "T-SHIRTS", "POLO SHIRTS"],
    "PANTS": ["JEANS", "CHINOS", "TROUSERS", "SHORTS"],
    "SHOES": ["SNEAKERS", "BOOTS", "LOAFERS", "FORMAL SHOES"],
    "ACCESSORIES": ["WATCHES", "BELTS", "WALLETS", "HATS"]
  },
  "KIDS": {
    "BOYS": ["T-SHIRTS", "PANTS", "SHOES", "JACKETS"],
    "GIRLS": ["DRESSES", "TOPS", "SHOES", "SKIRTS"],
    "BABIES": ["ONESIES", "BODYSUITS", "ACCESSORIES", "TOYS"]
  },
  "BEAUTY": {
    "MAKEUP": ["LIPSTICK", "FOUNDATION", "MASCARA", "EYESHADOW"],
    "SKINCARE": ["SERUMS", "MOISTURIZERS", "MASKS", "CLEANSERS"],
    "HAIRCARE": ["SHAMPOO", "CONDITIONER", "HAIR OIL", "STYLING"]
  },
  "ELECTRONICS": {
    "PHONES": ["SMARTPHONES", "TABLETS", "ACCESSORIES", "CASES"],
    "LAPTOPS": ["GAMING", "BUSINESS", "ULTRABOOKS", "ACCESSORIES"],
    "AUDIO": ["HEADPHONES", "SPEAKERS", "EARBUDS", "MICROPHONES"]
  }
};

export default staticCategoryStructure;