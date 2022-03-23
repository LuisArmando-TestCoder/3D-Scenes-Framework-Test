export default (amount: number) => {
    return [...new Array(amount)].map((_, x) => ({
        x: Math.round(x/Math.atan(x)*Math.sin(x)),
        y: Math.round(x/Math.atan(x)*Math.cos(x)),
    }));
}