'use strict';

import React from 'react';

const TYPES = [
    'text',
    'email',
    'password',
    'radio',
    'checkbox'
];

export default class Input extends React.Component {
    constructor(props) {
        let state = {};
        state.value = props.value;

        if (props.type == 'radio' || props.type == 'checkbox')
            state.checked = props.checked;

        super(props);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onChange     = this._onChange.bind(this);

        this.state = state;
    }

    componentDidUpdate(prevProps, prevState){
        if (
            !(this._isRadioButton() || this._isCheckbox()) && this.state.value != prevState.value ||
            (this._isRadioButton() || this._isCheckbox()) && (this.state.checked != prevState.checked)
           ){
            this.props.changeCallback();
        }
    }

    _onChange(e) {
        let value = e.target.value;
        let checked = e.target.checked;

        if (this._isRadioButton() || this._isCheckbox()){
            if (checked == this.state.checked)
                return;
        } else {
            if (value == this.state.value)
                return;
        }

        this.setState({
            value:      value,
            checked:    checked
        });
    }

    _isRadioButton(){
        return this.props.type == 'radio';
    }

    _isCheckbox(){
        return this.props.type == 'checkbox';
    }

    _onMouseEnter(e) {
        this.props.mouseEnterCallback();
    }

    _onMouseLeave(e) {
        this.props.mouseLeaveCallback();
    }

    value(v){
        if (typeof v === 'undefined'){
            return this.state.value;
        } else {
            this.setState({value: v});
        }
    }

    checked(v){
        if (!(this._isRadioButton() || this._isCheckbox()))
            throw new Error("Input type '" + this.props.type + "' doesn't support 'checked'");

        if (typeof v === 'undefined'){
            return this.state.checked;
        } else {
            this.setState({checked: v});
        }
    }

    render(){
        let classes = (this.props.validate ? "validate " : "") + this.props.extraClass;

        return (
            <input placeholder={this.props.placeholder}
                   id={this.props.id}
                   type={this.props.type}
                   disabled={this.props.disabled}
                   required={this.props.required}
                   name={this.props.name}
                   onChange={this._onChange}
                   onMouseEnter={this._onMouseEnter}
                   onMouseLeave={this._onMouseLeave}
                   className={classes}/>
        );
    }
}

Input.displayName = "GenericInputElement";
Input.propTypes = {
    disabled:           React.PropTypes.bool,
    required:           React.PropTypes.bool,
    validate:           React.PropTypes.bool,
    value:              React.PropTypes.string,
    name:               React.PropTypes.string,
    placeholder:        React.PropTypes.string,
    id:                 React.PropTypes.string,
    type:               React.PropTypes.oneOf(TYPES),
    extraClass:         React.PropTypes.string,
    changeCallback:     React.PropTypes.func,
    mouseEnterCallback: React.PropTypes.func,
    mouseLeaveCallback: React.PropTypes.func
};
Input.defaultProps = {
    disabled:           false,
    required:           false,
    validate:           false,
    value:              '',
    name:               '',
    placeholder:        '',
    id:                 '',
    type:               'text',
    extraClass:         '',
    changeCallback:     function(){},
    mouseEnterCallback: function(){},
    mouseLeaveCallback: function(){}
};
