export function copyContent(event: MouseEvent, data: string) {
    const button = event.currentTarget as HTMLButtonElement
    navigator.clipboard.writeText(data).then(() => {
        button.classList.add("copied")
        setTimeout(() => button.classList.remove("copied"), 500)
    })
}
