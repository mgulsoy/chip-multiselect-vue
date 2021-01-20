import chipMultiselectVue from './components/chip-multiselect-vue.vue';

export default chipMultiselectVue

if (typeof window !== 'undefined' && window.Vue) {
  //register browser namespace
  //console.log('Loading chip-multiselect-vue:', chipMultiselectVue);
  window.chipMultiselectVue = chipMultiselectVue;
} else {
  console.warn('chip-multiselect-vue cannot find a window to bind');
}