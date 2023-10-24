let limit = 1260;

export default (function saveMe() {
    let observer;

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${limit}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.count);
            data.results.forEach(entry => {
                fetch(entry.url)
                    .then(currentRes => currentRes.json())
                    .then(currentData => {
                        const DIV = document.createElement('div')
                        DIV.className = 'pokemon'

                        DIV.innerHTML = `
                            <span class="pokemon__name">${currentData.name}</span>
                            <img src="${currentData.sprites.front_default}">
                        `

                        if (currentData.name == data.results[data.results.length - 1].name) {
                            const options = {
                                rootMargin: '0px',
                                threshold: 1.0,
                            }

                            observer = new IntersectionObserver(function(e) {
                                e.forEach(entry => {
                                    if (!entry.isIntersecting) return

                                    if (entry.intersectionRatio >= 0.75) {
                                        if (limit + 10 < data.count) {
                                            limit += 10;

                                        }

                                        saveMe()

                                        observer.unobserve(DIV)
                                    }
                                })
                            }, options)

                            observer.observe(DIV)
                        }

                        document.body.append(DIV);
                    })
            })
        })
})()