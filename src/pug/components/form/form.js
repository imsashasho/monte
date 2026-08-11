import * as yup from 'yup';
import axios from 'axios';
import initView from './form-view';

const sendForm = async (data) => {
  const response = await axios.post('/api/v1/send-leads', data);
  return response.data;
};

export default class FormMonster {
  constructor(setting) {
    this.elements = setting.elements;
    this.$body = document.querySelector('body');
    this.showSuccessMessage = setting.showSuccessMessage || true;

    this.state = {
      serverError: null,
      error: true,
      form: setting.elements.fields,
      status: 'filling',
    };
    this.fieldsKey = Object.keys(this.elements.fields);
    this.watchedState = initView(this.state, this.elements);

    this.init();
  }

  validate(formData) {
    const formDataObj = this.fieldsKey.reduce((acc, key) => {
      acc[key] = formData.get(key);
      return acc;
    }, {});
    /*  */
    const shapeObject = this.fieldsKey.reduce((acc, key) => {
      acc[key] = this.elements.fields[key].rule;
      return acc;
    }, {});
    /*  */

    const schema = yup.object().shape(shapeObject);

    try {
      schema.validateSync(formDataObj, { abortEarly: false });
      return null;
    } catch (err) {
      return err.inner;
    }
  }

  // New method to reset the form
  resetForm() {
    // Reset the actual HTML form element
    this.elements.$form.reset();

    // Reset the state for each field
    this.fieldsKey.forEach((key) => {
      const field = this.elements.fields[key];
      field.valid = true;
      field.error = [];

      // Clear any visual error indicators
      const { input } = field.inputWrapper;
      if (input.classList.contains('error')) {
        input.classList.remove('error');
      }

      // Reset any custom field types if needed
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else if (input.tagName === 'SELECT') {
        input.selectedIndex = 0;
      }
    });

    // Reset form state
    this.watchedState.error = true;
    this.watchedState.status = 'filling';

    // Return focus to the first input field (optional)
    const firstInput = this.fieldsKey[0];
    if (firstInput) {
      const firstInputElement = this.elements.fields[firstInput].inputWrapper.input;
      if (firstInputElement) {
        firstInputElement.focus();
      }
    }
  }

  changeInput() {
    return (e) => {
      /*  */
      e.preventDefault();
      this.watchedState.status = 'filling';
      /*  */
      const formData = new FormData(this.elements.$form);
      /*  */
      const error = this.validate(formData);
      /*  */
      this.fieldsKey.map((key) => {
        const field = this.elements.fields[key];
        field.valid = true;
        field.error = [];
        return null;
      });
      /*  */
      /*  */
      if (error) {
        error.forEach(({ path, message }) => {
          this.watchedState.form[path].valid = false;
          this.watchedState.form[path].error.push(message);
          return null;
        });
        this.watchedState.error = true;
        this.watchedState.status = 'renderErrorValidation';
        return null;
      }
      this.watchedState.error = false;
      this.watchedState.status = 'renderSuccessValidation';
      return null;
    };
  }

  submitForm() {
    return async (e) => {
      /*  */
      e.preventDefault();
      this.changeInput()(e);

      /*  */
      if (this.watchedState.error === false) {
        try {
          this.watchedState.status = 'loading';
          const formData = new FormData(this.elements.$form);
          formData.append('action', 'app');

          /* eslint-disable-next-line */
          const { error, code_error } = await sendForm(formData);

          // if (true) {
          if (error === 0) {
            this.watchedState.status = 'successSand';
            // Reset the form after successful submission
            this.resetForm();
            return true;
          }
          /* eslint-disable-next-line */
          this.watchedState.serverError = code_error;
          this.watchedState.status = 'failed';
        } catch (err) {
          this.watchedState.error = err.message;
          this.watchedState.serverError = 'front_error';
          this.watchedState.status = 'failed';
        }
      }
      return null;
    };
  }

  listers() {
    this.elements.$form.addEventListener('submit', this.submitForm(this.watchedState));
    this.fieldsKey.map((key) => {
      const { input } = this.elements.fields[key].inputWrapper;
      input.addEventListener('input', this.changeInput(this.watchedState));
      return null;
    });
  }

  init() {
    this.listers();
  }
}
