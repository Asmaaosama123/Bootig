export interface OfferItem {
    id: number;
    name: string;
    image: string;
    discount: string;
    price: number;
  }
  
  export const offersData: OfferItem[] = [
    {
      id: 1,
      name: "Casual T-Shirt",
      image:
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600",
      discount: "30% OFF",
      price: 99
    },
    {
      id: 2,
      name: "Denim Jacket",
      image:
        "https://images.pexels.com/photos/10026490/pexels-photo-10026490.jpeg?auto=compress&cs=tinysrgb&w=600",
      discount: "20% OFF",
      price: 149
    },
    {
      id: 3,
      name: "Elegant Skirt",
      image:
        "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600",
      discount: "25% OFF",
      price: 129
    }
  ];
  