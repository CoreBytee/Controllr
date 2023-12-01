module.exports = function (Length) {
    const Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let RandomNumber = ''
    for (let i = 0; i < Length; i++) {
        RandomNumber += Numbers[Math.floor(Math.random() * Numbers.length)]
    }
    return RandomNumber
}