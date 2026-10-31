import { AbstractControl } from '@angular/forms';

export function firstError(control: AbstractControl | null, label = 'Field'): string | null {
  if (!control || !control.touched || !control.errors) {
    return null;
  }

  if (control.errors['required']) return `${label} is required`;
  if (control.errors['email']) return 'Enter a valid email address';
  if (control.errors['minlength']) return `${label} is too short`;
  if (control.errors['maxlength']) return `${label} is too long`;
  if (control.errors['min']) return `${label} is too low`;
  if (control.errors['max']) return `${label} is too high`;
  if (control.errors['pattern']) return `${label} has an invalid format`;

  return 'Invalid value';
}
