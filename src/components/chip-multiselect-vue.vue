<template>
          <div id="template">            
            <div class="input-group mb-2" v-on:click="open($event)" ref="combo">
                <div class="form-control">
                    <span class="text-muted ml-2" style="user-select: none!important;" v-if="selectedElements.length == 0">{{placeholder}}</span>
                    <div class="d-flex flex-row bd-highlight mb-3 overflow-auto pill-container" >
                        <div class="d-inline-flex px-2 pill-tag" v-for="el in selectedElements" :key="getValue(el)">{{getLabel(el)}}
                          <svg class="pill-close align-self-center ml-1" v-on:click.stop="remove(el)" style="width:20px;height:20px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="input-group-append">
                    <div class="input-group-text"><svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M7,10L12,15L17,10H7Z" />
                        </svg></div>
                </div>
            </div>
            <div class="card" style="height:200px;z-index:1000;position:fixed;" v-show="boxShown" v-bind:style="{width:cardWidth}" ref="listCard">
                <div class="card-header" v-if="searchable == 'true'">
                    <input type="text" class="form-control" v-model="typed" ref="searchInput" />
                </div>
                <div class="card-body overflow-auto">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item p-1" v-for="opt in graph" :key="getValue(opt)" v-on:click="select(opt)" >{{getLabel(opt)}}</li>
                    </ul>
                </div>
            </div>
        </div>    
</template>

<script>
  export default {
    name: 'chipMultiselectVue',
     data() {
                return {
                    selectedElements: [],
                    selectedValues: [],
                    typed: '',
                    boxShown: false,
                    cardWidth: '40px',
                    phEnable: true
                };
            },
            props: [ 'placeholder', 'searchable', 'optionlabel', 'optionvalue', 'options', 'modelValue' ],
            emits: [ 'update:modelValue' ],
            computed: {
                graph() {
                    let q = this.typed.toLocaleLowerCase();

                    //Önce seçili olanları göstermeyiz.

                    return this.options.filter( x => {
                        //Seçili olanlar gösterilmez
                        let p1 = this.selectedElements.includes( x );
                        let p2 = this.getLabel( x ).toLocaleLowerCase().includes( q );
                        return !p1 && p2;
                    } );
                    //console.log( 'graph invoked:',q );

                   /* return this.p_options.filter( x => {
                        let q1 = this.getLabel( x ).toLocaleLowerCase();
                        return q1.includes( q );
                    } );*/
                }
            },
                       
            mounted() {
                //console.log( 'Component mounted' );
                document.addEventListener( 'click', this.handleOutsideClick );
            },

            methods: {
                handleOutsideClick( ev ) {
                    //console.log( 'Dışarı tıklandı: ', this.boxShown, ev );
                    if ( this.boxShown ) {
                        //Kutu gösterilirken
                        if ( !( this.$refs.listCard.contains( ev.target ) || this.$refs.combo.contains( ev.target ) ) ) {
                            //Açıkken dışına tıklanmış, kapatılır.
                            this.boxShown = false;
                            //console.log( 'kapat' );
                        }
                    }           
                },

                key( ev ) {
                    //console.log( ev );
                    if ( ev.key == 'Enter' ) {
                        //Commit
                        this.selectedElements.push( this.typed );
                        this.typed = '';
                    } else if ( ev.key == 'Backspace' ) {
                        let l = this.typed.length;
                        this.typed = this.typed.substring( 0, l - 1 );
                    } else {
                        this.typed += ev.key;
                    }
                },

                select( sel ) {
                    //console.log( 'seçilen:', sel );
                    this.selectedElements.push( sel );
                    if ( this.optionvalue ) {
                        this.selectedValues = [];
                        this.selectedElements.forEach( x => this.selectedValues.push( this.getValue( x ) ) );
                        this.$emit( 'update:modelValue', this.selectedValues );
                    } else {
                        this.$emit( 'update:modelValue', this.selectedElements );
                    }
                    
                },

                remove( sel ) {
                    //this.selectedElements.pop( sel );
                    //console.log( 'remove called' );
                    let i = this.selectedElements.findIndex( x => x === sel );
                    this.selectedElements.splice( i, 1 );
                    if ( this.optionvalue ) {
                        this.selectedValues = [];
                        this.selectedElements.forEach( x => this.selectedValues.push( this.getValue( x ) ) );
                        this.$emit( 'update:modelValue', this.selectedValues );
                    } else {
                        this.$emit( 'update:modelValue', this.selectedElements );
                    }
                },

                open(ev) {
                    //Arama kutusunu gösteririz.
                    //console.log( 'open called' );
                    this.boxShown = !this.boxShown;
                    if ( this.boxShown ) {
                        this.cardWidth = ev.currentTarget.offsetWidth + 'px';     
                        if ( this.searchable == 'true' ) {
                            var inpEl = this.$refs.searchInput;
                            setTimeout( () => inpEl.focus(), 80 );
                        }                        
                    }
                    
                },

                getLabel( orn ) {
                    if ( typeof ( orn ) == 'string' ) {
                        return orn;
                    } else {
                        if ( this.optionlabel ) {
                            return orn[ this.optionlabel ];
                        } else {
                            return 'Etiket tanımlayın!';
                        }
                        
                    }
                },

                getValue( orn ) {
                    if ( typeof ( orn ) == 'string' ) {
                        return orn;
                    } else {
                        if ( this.optionvalue ) {
                            return orn[ this.optionvalue ];
                        } else {
                            return orn;
                        }

                    }
                }
            }

  }
</script>

 <style scoped>
        .pill-tag {
            font-size: 1em;
            border: 1px solid var(--cizre);
            border-radius: 12px;
            padding-left: 5px;
            padding-right: 5px;
            margin-right: 2px;
            background-color: rgba(174, 125, 55, 0.28);
        }

        .pill-close:hover {
            background-color: red;
            color: white;
            border-radius: 11px;
        }
                
        .pill-container::-webkit-scrollbar {
            height: 2px;
        }

        .pill-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 60px;
        }

        .pill-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 60px;
        }
    </style>