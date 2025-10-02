// Devuelve la cadena original con totas las palabras en letra capital. Ej: "diego junior llusco chui" -> "Diego Junior Llusco Chui"
export function letraCapital(str: string): string {
    // Lista de palabras que NO se capitalizan (puedes añadir más)
    const palabrasNoCapitalizar = ['de', 'la', 'lo', 'en', 'y', 'a', 'el', 'un', 'una', 'los', 'las'];

    // Expresión regular para números romanos (ej: II, III, IV, etc.)
    const regexRomanos = /^[IVXLCDM]+$/i;

    if (str.includes(' ')) {
        const arrayString = str.toLowerCase().split(" ");
        for (let i = 0; i < arrayString.length; i++) {
            // Si es número romano, lo deja en mayúsculas
            if (regexRomanos.test(arrayString[i])) {
                arrayString[i] = arrayString[i].toUpperCase();
            }
            // Si no es palabra "no importante", capitaliza
            else if (!palabrasNoCapitalizar.includes(arrayString[i]) || i === 0) {
                arrayString[i] = arrayString[i].charAt(0).toUpperCase() + arrayString[i].slice(1);
            }
        }
        return arrayString.join(" ");
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Devuelve la cadena original con la primera palabra en letra capital. Ej: "diego junior llusco chui" -> "Diego junior llusco chui"
export function letraCapitalInicial(str: string): string {
    if (str.includes(' ')) {
        const arrayString = str.split(" ");

        arrayString[0] = arrayString[0].charAt(0).toUpperCase() + arrayString[0].slice(1);
        const frase = arrayString.join(" ");

        return frase;
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Devuelve la primera palabra de una cadena. Ej:"Diego Junior Llusco Chui" -> "Diego"
export function returnPrimerSubString(nombres: string): string {
    const arrayString = nombres.split(" ");
    let str = arrayString[0];
    return str;
}

// Devuleve una cadena en mayúsculas de todas las letras iniciales de cada palabra. Ej:"Diego Junior Llusco Chui" -> "DJLC"
export function inicialesCapital(str: string): string {
    const arrayString = str.split(" ");
    for (var i = 0; i < arrayString.length; i++) {
        arrayString[i] = arrayString[i].charAt(0).toUpperCase();
    }
    const frase = arrayString.join("");
    return frase;
}

// Devuelve cadena de numeros con ceros a la izquierda
export function addCerosIzquierda(num: number, digitos: number): string {
    // 1. Convertir el número a cadena de texto.
    const numStr = String(num);

    // 2. Usar padStart para rellenar la cadena con '0' hasta la longitud 'digitos'.
    return numStr.padStart(digitos, '0');
}

export function getCodigoSecuencia(str: string, digitps: number): string {
    const arrayString = str.split("-");

    return addCerosIzquierda(Number(arrayString[arrayString.length - 1]) + 1, 4);
}

// Devuelve monto con coma decimal sin Bs. Ej. 5000 -> 5,000.00
export function formatoMonto(monto: number) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
    })
    return formatter.format(monto)
}

// Devuelve monto con coma decimal Con Bs. Ej. 5000 -> Bs. 5,000.00
export function formatoBsMonto(monto: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
    })
    return 'Bs. ' + formatter.format(monto)
}

// Devuelve monto de texto a number. Ej. 5,000 Bs. -> 5000
export function convertirStringANumero(montoString: string): number {
    // Eliminar caracteres no numéricos excepto puntos, comas y signos
    const numeroLimpio = montoString.replace(/[^\d,.-]/g, '');

    // Reemplazar TODAS las comas por puntos si es necesario
    const numeroParseable = numeroLimpio.replace(/,/g, '');

    // Convertir a número
    const numero = parseFloat(numeroParseable);

    // Verificar si el resultado es un número válido
    if (isNaN(numero)) {
        return 0;
    }

    return numero;
}

// Devuelve Formato de nombre completo. ej. Llusco Chui Diego Junior -> Diego Junior Llusco Chui
export function formatoNombreCompleto(fullName: string): string {
    if (!fullName || !fullName.trim()) return '';

    // Dividir el nombre en partes y eliminar espacios vacíos
    const parts = fullName.trim().split(/\s+/).filter(part => part.length > 0);

    // Caso 1: Paterno Materno Nombre Segundo -> Nombre Segundo Paterno Materno
    if (parts.length >= 4) {
        const [paterno, materno, nombre, segundo] = parts;
        return `${nombre} ${segundo} ${paterno} ${materno}`;
    }

    // Caso 2: Paterno Materno Nombre -> Nombre Paterno Materno (no hay segundo nombre)
    if (parts.length === 3) {
        const [paterno, materno, nombre] = parts;
        return `${nombre} ${paterno} ${materno}`;
    }

    // Caso 3: Paterno Nombre -> Nombre Paterno
    if (parts.length === 2) {
        const [paterno, nombre] = parts;
        return `${nombre} ${paterno}`;
    }

    // Si solo tiene una parte, devolverla tal cual
    return fullName;
}

// Devuelve objeto de array donde coincida 'value'
export function getObjectByValue<T>(value: string, array: any[]): any {
    return array.find(item => item.value === value) || null || undefined;
}

export function getObjectByData<T>(data: string, array: any[]): any {
    return array.find(item => item.data === data) || null;
}

export function calcularAntiguedad(fechaStr: string): string {
    if (!fechaStr) return '0';

    // Convertir el string a un objeto Date
    const fechaInicio = new Date(fechaStr);
    const fechaActual = new Date();

    // Calcular la diferencia en años
    let anios = fechaActual.getFullYear() - fechaInicio.getFullYear();
    let meses = fechaActual.getMonth() - fechaInicio.getMonth();

    // Ajustar si aún no ha pasado el mes y día de este año
    if (meses < 0) {
        anios--;
        meses += 12;
    }

    return `${anios} años y ${meses} meses`;
}

export function generateRandomPassword() {
    // Implementa una función para generar contraseñas seguras
    const length = 10;
    const characters = 'abcdefghijkmnopqrstwxyzABCDEFGHJKLMNPQRSTWXYZ23456789!@#$%&*+-';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

export function normalizarNumero(numero: string): string {
    // Elimina todo excepto dígitos
    const numeroLimpio = numero.replace(/\D/g, '');

    // Si empieza con 591 (sin prefijo internacional), ya está normalizado
    if (numeroLimpio.startsWith('591') && numeroLimpio.length === 11) {
        return numeroLimpio;
    }

    // Si empieza con +591 o 00591, extrae los últimos 8 dígitos y añade 591
    if (
        (numeroLimpio.startsWith('591') && numeroLimpio.length > 11) ||
        numeroLimpio.startsWith('00591')
    ) {
        return '591' + numeroLimpio.slice(-8); // Ej: "+59177255776" -> "591" + "77255776"
    }

    // Si no tiene prefijo (ej: "77255776"), añade 591
    if (numeroLimpio.length === 8) {
        return '591' + numeroLimpio;
    }

    // Si no cumple ningún formato válido, devuelve el original (o lanza un error)
    console.warn('Formato de número no reconocido:', numero);
    return numeroLimpio;
}