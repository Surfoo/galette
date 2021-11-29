<fieldset class="{if isset($social_fieldset_class)}{$social_fieldset_class}{else}cssform{/if}" id="social">
    <legend{if isset($social_fieldset_legend_class)} class="{$social_fieldset_legend_class}"{/if}>{_T string="Social networks"}</legend>
    <div>
    {foreach item=social from=$socials}
        <p>
            <label for="social_{$social->id}" class="bline">{$social->getSystemType($social->type)}</label>
            <span>
                <input type="text" name="social_{$social->id}" id="social_{$social->id}" value="{$social->url}" class="large"/>
                <a href="#" class="fright tooltip delete delsocial">
                    <i class="fas fa-trash-alt"></i>
                    <span class="sr-only">{_T string="Remove %type" pattern="/%type/" replace=$social->getSystemType($social->type)}</span>
                </a>
            </span>
        </p>
    {/foreach}
    <p>
        <span class="bline">{_T string="Add new social network"}</span>
        <span>
            <select name="social_new_type_1" id="social_new_type_1" class="nochosen socials_selector">
                <option value="">{_T string="Choose or enter your own..."}</option>
    {foreach item=social_type from=$osocials->getSystemTypes(false)}
                <option value="{$social_type}">{$osocials->getSystemType($social_type)}</option>
    {/foreach}
            </select>
            <input type="text" name="social_new_value_1" id="social_new_value_1" value="" size="50"/>
            <a href="#" class="fright tooltip action addsocial">
                <i class="fas fa-plus-square"></i>
                <span class="sr-only">{_T string="Add"}</span>
            </a>
        </span>
        <script type="text/javascript">
            var _selectize = function(selector) {
                if ( !selector ) {
                    selector = '.socials_selector';
                }

                $(selector).selectize({
                    maxItems: 1,
                    create: true,
                    createOnBlur: true
                });
            }

            $('.addsocial').click(function(e){
                e.preventDefault();
                $('.socials_selector').each(function(){ // do this for every select with the 'combobox' class
                    var _this = $(this);
                    if (_this[0].selectize) { // requires [0] to select the proper object
                        var value = $(this).val(); // store the current value of the select/input
                        _this[0].selectize.destroy(); // destroys selectize()
                        _this.val(value);  // set back the value of the select/input
                    }
                });

                var _newindex = $(this).parents('fieldset').find('p:last select').attr('id').replace('social_new_type_', '');
                ++_newindex;
                $(this).parents('p')
                    .clone() // copy
                    .insertAfter('#social p:last') // where
                    .find('select').attr('id', 'social_new_type_' + _newindex).attr('name', 'social_new_type_' + _newindex)
                    .parent().find('input').attr('id', 'social_new_value_' + _newindex).attr('name', 'social_new_value_' + _newindex)
                    .parent().find('.addsocial').remove()
                ;

                _selectize();
            });

            var _rmFilter = function(elt) {
                if ( typeof elt == 'undefined') {
                    elt = $('#social p');
                }
                elt.find('.delsocial').click(function(e){
                    e.preventDefault();
                    var _this = $(this);
                    _this.parents('p').remove();
                });
            }
            _rmFilter();
            _selectize();
        </script>
    </p>
    </div>
</fieldset>