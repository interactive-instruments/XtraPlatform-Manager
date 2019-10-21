import React from 'react';

export default function uivalidator(validators = {}, initialStateIsValid = false) {
    Object.keys(validators).forEach(key => {
        if (Array.isArray(validators[key])) {
            const vldtr = validators[key];
            validators[key] = (value, otherValues, props) => vldtr.reduce((prev, func) => prev !== null ? prev : func(value, otherValues, props), null)
        }
    })

    let initial;

    return (WrappedComponent) => {
        return (props) => {
            const { ui, validator } = props;

            const result = validator ? validator : {
                valid: true,
                messages: {}
            };
            //console.log('UI', ui, initial, result);

            if (ui) {
                if (!initial) {
                    initial = ui;
                }

                Object.keys(validators).forEach(key => result.messages[key] = validators[key](ui[key], ui, props));
                result.valid = Object.keys(validators).reduce((vld, key) => vld && !result.messages[key] && (initialStateIsValid || ui[key] !== initial[key]), result.valid)

                //console.log('VALID', result.messages, result.valid);
            }


            return <WrappedComponent {...props} validator={result} />
        }
    }
}

export const validator = (validators = {}, initialStateIsValid = false) => {
    Object.keys(validators).forEach(key => {
        if (Array.isArray(validators[key])) {
            const vldtr = validators[key];
            validators[key] = (value, otherValues) => vldtr.reduce((prev, func) => prev !== null ? prev : func(value, otherValues), null)
        }
    })

    //TODO: this only works if validator definition is outside of component
    let initial;

    return (ui, validator) => {

        //TODO: I guess this is for parent validators
        const result = validator ? validator : {
            valid: true,
            messages: {}
        };
        //console.log('UI', ui, initial, result);

        if (ui) {
            if (!initial) {
                initial = { ...ui };
            }

            Object.keys(validators).forEach(key => result.messages[key] = validators[key](ui[key], ui));
            result.valid = Object.keys(validators).reduce((vld, key) => vld && !result.messages[key] && (initialStateIsValid || ui[key] !== initial[key]), result.valid)

            //console.log('VALID', result.messages, result.valid);
        }


        return result
    }
}

export const required = () => (value) => !value ? 'required' : null

export const equals = (otherKey, otherLabel) => (value, otherValues) => value.length > 0 && value !== otherValues[otherKey] ? `does not equal ${otherLabel || otherKey}` : null

export const differs = (otherKey, otherLabel) => (value, otherValues) => value.length > 0 && value === otherValues[otherKey] ? `may not equal ${otherLabel || otherKey}` : null

export const minLength = (length) => (value) => value.length > 0 && value.length < length ? `at least ${length} characters are required` : null

export const maxLength = (length) => (value) => value.length > length ? `no more than ${length} characters are allowed` : null

export const allowedChars = (pattern) => (value) => value.match(new RegExp(`[^${pattern}]`)) ? `character '${value.match(new RegExp(`[^${pattern}]`))}' is not allowed` : null

export const forbiddenChars = (pattern) => (value) => value.match(new RegExp(`[${pattern}]`)) ? `character '${value.match(new RegExp(`[${pattern}]`))}' is not allowed` : null

export const url = () => (value) => value.length > 0 && !value.match(/^https?:\/\/[\w.-]+(?:\.[\w\.-]+)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i) ? `invalid URL` : null

