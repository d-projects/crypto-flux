export default (coinId: string, coinSymbol?: string) => {
    const nameParts = coinId.split("-");
    let nameString = "";
    nameParts.forEach((part: string) => {
        nameString += part.charAt(0).toUpperCase() + part.slice(1) + " ";
    });
    if (coinSymbol) {
        nameString += "(" + coinSymbol + ")";
    } else {
        nameString = nameString.substring(0, nameString.length - 1);
    }
    return nameString;
}