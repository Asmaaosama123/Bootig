import { Restaurant } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    category: 'Italian',
    description: 'Authentic Italian cuisine with fresh ingredients',
    menu: [
      {
        id: '1-1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
        price: 14.99,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Pizza',
        popular: true
      },
      {
        id: '1-2',
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with pancetta, eggs, and parmesan cheese',
        price: 16.99,
        image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Pasta'
      },
      {
        id: '1-3',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 7.99,
        image: 'https://images.pexels.com/photos/6940978/pexels-photo-6940978.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Dessert'
      }
    ]
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    deliveryTime: '20-30 min',
    deliveryFee: 3.49,
    category: 'Japanese',
    description: 'Fresh sushi and Japanese delicacies',
    menu: [
      {
        id: '2-1',
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 12.99,
        image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Sushi',
        popular: true
      },
      {
        id: '2-2',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll',
        price: 10.99,
        image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Rolls'
      }
    ]
  },
  {
    id: '3',
    name: 'Burger Junction',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    category: 'American',
    description: 'Gourmet burgers and crispy fries',
    menu: [
      {
        id: '3-1',
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
        price: 13.99,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Burgers',
        popular: true
      },
      {
        id: '3-2',
        name: 'Crispy Fries',
        description: 'Golden crispy french fries with sea salt',
        price: 5.99,
        image: 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Sides'
      }
    ]
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    category: 'Mexican',
    description: 'Authentic Mexican street food and tacos',
    menu: [
      {
        id: '4-1',
        name: 'Beef Tacos',
        description: 'Three soft tacos with seasoned beef, onions, and cilantro',
        price: 11.99,
        image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Tacos',
        popular: true
      }
    ]
  }
];

export const categories = ['All', 'Italian', 'Japanese', 'American', 'Mexican', 'Chinese', 'Indian'];