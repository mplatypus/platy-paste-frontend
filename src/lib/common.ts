export function copyContent(event: MouseEvent, data: string) {
    const button = event.currentTarget as HTMLButtonElement
    navigator.clipboard.writeText(data).then(() => {
        button.classList.add("copied")
        setTimeout(() => button.classList.remove("copied"), 500)
    })
}

export function toISO8601Timestamp(time: Date): string {
    var utcString = time.toISOString().substring(0, 19)
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDate()
    var hour = time.getHours()
    var minute = time.getMinutes()

    return (
        year +
        "-" +
        (month < 10 ? "0" + month.toString() : month) +
        "-" +
        (day < 10 ? "0" + day.toString() : day) +
        "T" +
        (hour < 10 ? "0" + hour.toString() : hour) +
        ":" +
        (minute < 10 ? "0" + minute.toString() : minute) +
        utcString.substring(16, 19)
    )
}
