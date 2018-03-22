/**
 * Component
 * ab-layer
 */

class abLayerCtrl {

    constructor() {
        //
    }

    $onInit() {
        //
    }

}

const template = `
    <div class="ab-layer-content" ng-transclude></<div>
`

export default {
    controller: abLayerCtrl,
    template,
    bindings: {},
    transclude: true
}
