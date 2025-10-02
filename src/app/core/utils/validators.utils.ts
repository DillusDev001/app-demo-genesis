import { AbstractControl, ValidationErrors } from '@angular/forms';
import { evaluate } from 'mathjs';

export function numberValidator(maxValue?: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value === null || value === undefined) {
            return null; // Permite valores vacíos
        }

        const valueStr = String(value).trim();

        if (valueStr === '') {
            return null; // Permite valores vacíos
        }

        if (!/^[0-9+\-*/\s.]+$/.test(valueStr)) {
            return { invalidCharacters: true };
        }

        try {
            const result = evaluate(valueStr); // Usa `mathjs` en lugar de `eval()`

            if (isNaN(result)) {
                return { notNumber: true };
            }

            if (maxValue !== undefined && result > maxValue) {
                return { max: { maxValue, actual: result } };
            }

            return null; // La entrada es válida
        } catch (error) {
            return { notNumber: true };
        }
    };
}
