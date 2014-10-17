YUI.add('aui-form-builder-layout-builder-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-builder-layout-builder');

    suite.add(new Y.Test.Case({
        name: 'AUI Form Builder Layout Builder Unit Tests',

        tearDown: function() {
            if (this._formBuilder) {
                this._formBuilder.destroy();
            }
        },

        _createFormBuilder: function(config, skipRender) {
            this._formBuilder = new Y.FormBuilder(Y.merge({
                layout: new Y.Layout({
                    rows: [
                        new Y.LayoutRow({
                            cols: [
                                new Y.LayoutCol({
                                    size: 4
                                }),
                                new Y.LayoutCol({
                                    size: 4
                                }),
                                new Y.LayoutCol({
                                    size: 4
                                })
                            ]
                        })
                    ]
                })
            }, config));

            if (!skipRender) {
                this._formBuilder.render('#container');
            }
        },

        'should be able to add rows on both regular and layout mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-add-row-button');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-add-row-button');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));
        },

        'should only be able to remove rows on layout mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));
        },

        'should not be able to add cols on regular mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-add-col');
            this._formBuilder.get('contentBox').all('.col').item(1).simulate('mouseover');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            this._formBuilder.get('contentBox').all('.col').item(1).simulate('mouseover');
            button = this._formBuilder.get('contentBox').one('.layout-add-col');
            Y.Assert.isNotNull(button);
        },

        'should not be able to remove cols on regular mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-remove-col');
            this._formBuilder.get('contentBox').all('.col').item(1).simulate('mouseover');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            this._formBuilder.get('contentBox').all('.col').item(1).simulate('mouseover');
            button = this._formBuilder.get('contentBox').one('.layout-remove-col');
            Y.Assert.isNotNull(button);
        },

        'should not be able to move rows/cols on regular mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-move-button');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-move-button');
            Y.Assert.isNotNull(button);
        },

        'should not be able to resize cols on regular mode': function() {
            var draggable;

            this._createFormBuilder();

            draggable = this._formBuilder.get('contentBox').one('.layout-builder-resize-col-draggable');
            Y.Assert.isNull(draggable);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            draggable = this._formBuilder.get('contentBox').one('.layout-builder-resize-col-draggable');
            Y.Assert.isNotNull(draggable);
        },

        'should add/remove css class when on/off layout mode': function() {
            this._createFormBuilder();

            Y.Assert.isFalse(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            Y.Assert.isTrue(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));

            this._formBuilder.set('mode', Y.FormBuilder.MODES.REGULAR);
            Y.Assert.isFalse(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));
        },

        'should enable/disable layout mode through a button': function() {
            var modeButton;

            this._createFormBuilder();

            modeButton = this._formBuilder.get('contentBox').one('.form-builder-layout-mode-button');
            modeButton.simulate('click');
            Y.Assert.areEqual(Y.FormBuilder.MODES.LAYOUT, this._formBuilder.get('mode'));

            modeButton.simulate('click');
            Y.Assert.areEqual(Y.FormBuilder.MODES.REGULAR, this._formBuilder.get('mode'));
        },

        'should allow setting custom button for enabling/disabling layout mode': function() {
            var modeButton = Y.Node.create('<button>Test Button</button>');

            Y.one('body').append(modeButton);
            this._createFormBuilder({
                layoutModeButton: modeButton
            });

            modeButton.simulate('click');
            Y.Assert.areEqual(Y.FormBuilder.MODES.LAYOUT, this._formBuilder.get('mode'));

            modeButton.simulate('click');
            Y.Assert.areEqual(Y.FormBuilder.MODES.REGULAR, this._formBuilder.get('mode'));
        },

        'should update layout when it changes': function() {
            var rowNodes;

            this._createFormBuilder();

            rowNodes = this._formBuilder.get('contentBox').all('.layout-row');
            Y.Assert.areEqual(2, rowNodes.size());

            this._formBuilder.set('layout', new Y.Layout());
            rowNodes = this._formBuilder.get('contentBox').all('.layout-row');
            Y.Assert.areEqual(1, rowNodes.size());
        },

        'should not break if changing mode and layout before rendering': function() {
            var button;

            this._createFormBuilder({}, true);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            this._formBuilder.set('mode', Y.FormBuilder.MODES.REGULAR);
            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);

            this._formBuilder.set('layout', new Y.Layout());

            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNull(button);
        },

        'should update with new attributes after rendering': function() {
            var button,
                rowNodes;

            this._createFormBuilder({}, true);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            this._formBuilder.set('layout', new Y.Layout());

            this._formBuilder.render('#container');
            rowNodes = this._formBuilder.get('contentBox').all('.layout-row');
            Y.Assert.areEqual(1, rowNodes.size());

            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-form-builder', 'node-event-simulate', 'test']
});