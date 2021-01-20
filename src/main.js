import chipMultiselectVue from './components/chip-multiselect-vue';

export default chipMultiselectVue

if (typeof window !== 'undefined' && window.Vue) {
  //register browser namespace
  window.chipMultiselectVue = chipMultiselectVue;
}