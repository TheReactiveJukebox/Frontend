export class Utils {

    public static capitalize(s: string): string {
        return s[0].toUpperCase() + s.slice(1);
    }

    public static round(value: number, digits?: number): number {
        if (digits) {
            value *= Math.pow(10, digits);
            value = Math.round(value);
            value /= Math.pow(10, digits);
            return value;
        } else {
            return Math.round(value);
        }
    }

}
