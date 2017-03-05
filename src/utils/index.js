const today = () =>
    new Date().setHours(0, 0, 0, 0) / 100000
const fromTimestamp = timestamp =>
    new Date(Number(timestamp + "00000"))

export { today, fromTimestamp }
