import { HttpErrorResponse } from '@angular/common/http';

export function userErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  switch (error.status) {
    case 0:
      return 'The service could not be reached. Check your connection and try again.';
    case 400:
      return 'Some details are invalid. Check them and try again.';
    case 401:
      return fallback;
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'That item could not be found.';
    case 409:
      return 'An item with that name already exists.';
    case 413:
      return 'This file is larger than the server allows.';
    case 429:
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return error.status >= 500
        ? 'The service encountered a problem. Try again shortly.'
        : fallback;
  }
}
