const angular = window.angular

// import angular from 'angular'

import abLayer from './ab-layer'
import abLayers from './ab-layers'

export default angular
    .module('@blunck/ab-layers', [])
    .component({ abLayer })
    .component({ abLayers })
    .name
