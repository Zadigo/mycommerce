function createClarity(tag) {
    var script = document.createElement('script')
    var content = document.createTextNode(`
    (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "40lq6t5uns");`)
    script.appendChild(content)
    var head = document.getElementsByTagName('head')
    head[0].appendChild(script)

    return {
        install: (Vue) => {
            tag
            Vue.mixin({})
        }
    }
}

export {
    createClarity
}
