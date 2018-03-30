import React from 'react';

export default function validator(validators = {}, initialStateIsValid = false) {
    Object.keys(validators).forEach(key => {
        if (Array.isArray(validators[key])) {
            const vldtr = validators[key];
            validators[key] = id => vldtr.reduce((prev, func) => prev !== null ? prev : func(id), null)
        }
    })

    let initial;

    return (WrappedComponent) => {
        return (props) => {
            const {ui, validator} = props;

            const result = validator ? validator : {
                valid: true,
                messages: {}
            };
            //console.log('UI', ui, initial, result);

            if (ui) {
                if (!initial) {
                    initial = ui;
                }

                Object.keys(validators).forEach(key => result.messages[key] = validators[key](ui[key]));
                result.valid = Object.keys(validators).reduce((vld, key) => vld && !result.messages[key] && (initialStateIsValid || ui[key] !== initial[key]), result.valid)

            //console.log('VALID', result.messages, result.valid);
            }


            return <WrappedComponent {...props} validator={ result } />
        }
    }
}

export const required = () => (value) => !value ? 'required' : null

export const minLength = (length) => (value) => value.length > 0 && value.length < 3 ? `at least ${length} characters are required` : null

export const allowedChars = (pattern) => (value) => value.match(new RegExp(`[^${pattern}]`)) ? `character '${value.match(new RegExp(`[^${pattern}]`))}' is not allowed` : null

export const forbiddenChars = (pattern) => (value) => value.match(new RegExp(`[${pattern}]`)) ? `character '${value.match(new RegExp(`[${pattern}]`))}' is not allowed` : null

export const url = () => (value) => value.length > 0 && !value.match(/^https?:\/\/[\w.-]+(?:\.[\w\.-]+)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i) ? `invalid URL` : null

