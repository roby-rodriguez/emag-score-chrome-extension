// TODO make grunt/gulp task that generates the <script>s html file from templates
function load(container, view, data) {
    $.get('templates/_generated.html', function(templates) {
        var template = $(templates).filter("#" + view).html()
        $(container)
            .empty()
            .append(Mustache.render(template, data))
    })
}
