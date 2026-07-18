export interface Order {
    userId: number | undefined;
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    paymentMethod: 'card' | 'cod';
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
    items: {
        productId: number;
        quantity: number;
    }[];
}
