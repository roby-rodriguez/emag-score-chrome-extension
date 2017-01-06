/**
 * Template for grid:
 *
 <button class="emg-button add-to-price-checker">
    <div class="emg-btn-icon">
        <span class="icon-i52-list-add"></span>
    </div>
    add to price-checker
 </button>
*/
function gridButton(target) {
    return $('<button/>', {
        type: "button",
        text: "track price", // urmareste pret
        class: "emg-button add-to-price-checker",
        click: function () {
            // TODO
        }
    }).append(
        $('<div/>', {
            class: "emg-btn-icon"
        }).append(
            $('<span/>', {
                class: "icon-i52-list-add"
            })
        )
    )
}
/**
 * Template for product home page:
 *
 <button class="btn btn-primary btn-emag btn-xl btn-block">
    <i class="emg-btn-icon" />
    add to price-checker
 </button>
*/
function productPageButton() {
    return $('<button/>', {
        type: "button",
        text: "track price", // urmareste pret
        class: "btn btn-primary btn-emag btn-xl btn-block",
        click: function () {
            // TODO
        }
    }).append(
        $('<i/>', {
            class: "em em-list-add_fill"
        })
    )
}

function oops() {

}

$("button.add-to-cart-new").each(function (index, value) {
    var clone = gridButton(this)
    clone.insertAfter(this)
})

$(".main-container-inner button.yeahIWantThisProduct").each(function (index, value) {
    var clone = productPageButton()
    clone.insertAfter(this)
})