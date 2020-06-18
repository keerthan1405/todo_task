import validator from 'validator';

export default function validate(values) {
    let errors = {};
// Validations
    if (!values.summary) {
        errors.summary = 'Summary is required';
    } else if (!(validator.isLength(values.summary, { min: 10, max: 140 }))) {
        errors.summary = 'Summary should be 10 - 140 characters';
    } else {
        errors.summary = '';
    }

    if (!values.description) {
        errors.description = 'Description is required';
    } else if (!(validator.isLength(values.description, { min: 10, max: 500 }))) {
        errors.description = 'Description should be 10 - 500 characters';
    } else {
        errors.description = '';
    }
    return errors;
};
