export class StringFormatter {
  static normalizeCategoryName(value: string) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }

  static escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
