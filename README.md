# QPay Gateway

[![Node Version][nodejs-image]][nodejs-url]
[![Vue Version][vue-image]][vue-url]
[![Vite Version][vite-image]][vite-url]
[![PrimeVue Version][primevue-image]][primevue-url]
[![Tailwind CSS Version][tailwind-image]][tailwind-url]

A modern, responsive Vue.js payment gateway application designed for seamless payment processing in Bangladesh. Built with Vue 3, Vite, and PrimeVue, this application provides a smooth checkout experience with support for mobile banking and card payments.

## Features

- **Mobile Banking Integration**: Support for popular Bangladeshi mobile banking services (bKash, Nagad, Rocket, Upay)
- **Card Payments**: Visa, Mastercard, American Express, and UnionPay support
- **Real-time Payment Status**: Automatic polling for payment verification
- **Responsive Design**: Mobile-first design optimized for all devices
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: Robust error handling with retry mechanisms
- **Brand Customization**: Dynamic branding support for different merchants

## Prerequisites

- Node.js (v16 or higher)
- pnpm package manager
- Backend API server running

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd qpay-gateway
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=https://api.example.com
   VITE_API_VERSION=v1
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Usage

### Payment Flow

1. **Checkout Page** (`/checkout/:paymentId`)

   - Displays merchant branding and payment amount
   - Shows available payment methods (Mobile Banking / Card Payment)
   - Provides transaction details and support information

2. **Payment Selection**

   - Choose between Mobile Banking or Card Payment
   - Select specific payment provider (bKash, Visa, etc.)

3. **Verification Page** (`/verify/:paymentId`)
   - Enter payment details (phone number, transaction ID)
   - Submit payment for processing
   - Automatic status polling until completion

### API Integration

The application expects a REST API with the following endpoints:

#### Get Payment Details

```
GET /{apiVersion}/payments/{paymentId}
```

Returns payment information including amount, currency, status, brand details, and metadata.

#### Execute Payment

```
POST /{apiVersion}/payments/{paymentId}/execute
```

Submits payment verification data and initiates processing.

**Request Body:**

```json
{
  "phone_number": "01xxxxxxxxx",
  "trx_id": "transaction_id"
}
```

**Response Statuses:**

- `COMPLETED`: Redirects to success URL
- `FAILED`: Redirects to failure URL
- `PENDING`: Starts polling for status updates

## Development

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint for code quality

### Code Quality

The project uses ESLint and Prettier for code formatting and quality assurance. Run `pnpm lint` to check and fix code issues.

### Environment Variables

| Variable            | Description                  | Required |
| ------------------- | ---------------------------- | -------- |
| `VITE_API_BASE_URL` | Base URL for the payment API | Yes      |
| `VITE_API_VERSION`  | API version (e.g., v1)       | Yes      |

## Customization

### Branding

The application supports dynamic branding through the API response. Brand information includes:

- Logo
- Name
- Support contact details
- Custom styling

### Payment Methods

Payment options are configurable through the component props. Add new payment methods by updating the options arrays in `PaymentMethod.vue`.

### Styling

Built with Tailwind CSS for easy customization. PrimeVue components use the Aura theme with custom overrides for consistent branding.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Check the transaction details tab for merchant contact information
- Review payment instructions for specific payment method guidance
- Contact the merchant directly for payment-related issues

---

[nodejs-image]: https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen
[nodejs-url]: https://nodejs.org/
[vue-image]: https://img.shields.io/badge/vue-3.5.13-brightgreen
[vue-url]: https://vuejs.org/
[vite-image]: https://img.shields.io/badge/vite-6.2.4-blue
[vite-url]: https://vitejs.dev/
[primevue-image]: https://img.shields.io/badge/primevue-4.3.3-purple
[primevue-url]: https://primevue.org/
[tailwind-image]: https://img.shields.io/badge/tailwindcss-4.1.4-blue
[tailwind-url]: https://tailwindcss.com/
