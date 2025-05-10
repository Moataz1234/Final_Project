# Sweet Alert Setup Instructions

This project uses Sweet Alert 2 for beautiful, responsive, customizable, and accessible popup boxes.

## Installation

To install Sweet Alert 2, run the following command in your terminal:

```bash
cd Frontend
npm install sweetalert2
```

## Usage

The notifications are already integrated throughout the application. The implementation includes:

1. Toast notifications for actions like:
   - Adding/removing items from cart
   - Adding/removing items from wishlist
   - Login/logout success
   - Form validation errors

2. Confirmation dialogs for important actions like:
   - Removing items from cart
   - Clearing wishlist
   - Canceling orders

## Customization

The styling for Sweet Alert is customized in:
- `src/utils/sweetalert-custom.css`

This file contains custom styles that match our application's design system.

## Utility Functions

The notification utility functions are defined in:
- `src/utils/notifications.jsx`

These functions include:
- `showSuccessToast`: For success messages
- `showErrorToast`: For error messages
- `showInfoToast`: For informational messages
- `showConfirmation`: For confirmation dialogs

## Example

```jsx
import { showSuccessToast } from '../utils/notifications';

// In your component
const handleAddToCart = () => {
  // Add to cart logic
  showSuccessToast('Item added to cart successfully!');
};
```

## Documentation

For more information on Sweet Alert 2, visit their official documentation:
[https://sweetalert2.github.io/](https://sweetalert2.github.io/) 