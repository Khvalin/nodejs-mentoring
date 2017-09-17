for (let i = 0; i < 5; i++) {
    let timer = setTimeout(() => console.log('tick'), 0)
    timer.unref()
}
