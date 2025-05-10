import Swal from 'sweetalert2';

/**
 * Show a success toast notification
 * @param {string} message - The message to display
 */
export const showSuccessToast = (message) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};

/**
 * Show an error toast notification
 * @param {string} message - The message to display
 */
export const showErrorToast = (message) => {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};

/**
 * Show an info toast notification
 * @param {string} message - The message to display
 */
export const showInfoToast = (message) => {
  Swal.fire({
    title: 'Info',
    text: message,
    icon: 'info',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};

/**
 * Show a confirmation dialog
 * @param {string} title - The title of the dialog
 * @param {string} text - The text to display
 * @param {string} confirmButtonText - The text for the confirm button
 * @param {Function} onConfirm - Callback function when confirmed
 */
export const showConfirmation = (title, text, confirmButtonText, onConfirm) => {
  Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText || 'Yes',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
}; 