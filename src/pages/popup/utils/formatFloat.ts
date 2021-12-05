export const formatFloatToPreciseString = (num: number) : String => {
    let formattedNum: String  = num.toString();
    if (formattedNum.split(".").length == 1) {
        formattedNum = num + ".00";
    }

    return formattedNum;
}