export function formatGameType(type: string): string {
    if (!type) return "Unknown";
    if (type === "standard") return "Ranked";
    if (type === "normal") return "Normal";
    if (type === "pairs") return "Double Up";
    if (type === "turbo") return "Hyper Roll";
    return type.charAt(0).toUpperCase() + type.slice(1);
}
