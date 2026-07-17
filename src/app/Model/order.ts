export interface Order {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    paymentMethod: 'card' | 'cod';
    cardNumber?: string;
    expiry?: string;
}
