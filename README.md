# materializecss-vuejs-component
SPA materializecss vuejs components
## Installation

`npm install --save materializecss-vuejs-component`

## Usage
```js
import Vue from 'vue';

import {callout} from 'materializecss-vuejs-component';
Vue.use(callout);

import MInput from 'materializecss-vuejs-component/matcss_input';
import MList from 'materializecss-vuejs-component/matcss_list';
import MDropdown from 'materializecss-vuejs-component/matcss_dropdownButton';
import MCheckBox from 'materializecss-vuejs-component/matcss_checkbox';
import MCollections from 'materializecss-vuejs-component/matcss_collections';
import MModal from 'materializecss-vuejs-component/matcss_modal';
import MSelect from 'materializecss-vuejs-component/matcss_select';
import MAutocomplete from 'materializecss-vuejs-component/matcss_autocomplete';

Vue.component(
    'm-input',
    MInput
);

Vue.component(
    'm-list',
    MList
);

Vue.component(
    'm-dd',
    MDropdown
);

Vue.component(
    'm-checkbox',
    MCheckBox
);

// or dynamic load
Vue.component(
    'm-autocomplete',
    () => import('materializecss-vuejs-component/matcss_autocomplete') // Dynamic load
);

// in Vue components:

m-autocomplete(name="Find User", :val.sync="formData.user", :url="queryURLAutocomplete")
m-select(name="Select", :items="positionsList", :selected-id.sync="formData.positionId")
m-input(name="E-Mail", :val.sync="formData.mail")
m-input(name="Phone", :val.sync="formData.phone")
m-checkbox(v-if="isNew", name="Delete item", :checked.sync="formData.isDelete")
```
