/**
 * Component
 * ab-layer
 */

class abLayerCtrl {

    static get $inject() {
        return ['$scope', '$element', '$attrs']
    }

    constructor($scope, $element, $attrs) {
        if ($scope.$parent.$eval($attrs.hideIf)) {
            $element.remove()
        }
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
