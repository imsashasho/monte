import * as yup from 'yup';
import i18next from 'i18next';
import FormMonster from '../../../pug/components/form/form';
import SexyInput from '../../../pug/components/input/input';
import { successPopup } from './successPopup';
import { lockDocument, unlockDocument } from './lenis-stop-handlers';

export const contactForm = (formRef, onSuccess) => {
  const btnRef = formRef.querySelector('[data-btn-submit]');
  new FormMonster({
    elements: {
      $form: formRef,
      $btnSubmit: btnRef,
      showSuccessMessage: false,
      successAction: function () {
        const $form = this.$form;

        // The success card lives INSIDE the popup overlay, which is
        // `opacity: 0` when closed — so a form that isn't inside the overlay
        // (e.g. the footer form) must open the overlay too, otherwise the
        // success card stays invisible. For the popup's own form the overlay
        // is already open, so this is a no-op.
        const overlay = document.querySelector('[data-form-popup]');
        const isInPopup = Boolean($form.closest('[data-form-popup]'));
        if (!isInPopup && overlay) {
          overlay.classList.add('active');
          lockDocument('form-success');
        }

        successPopup.open();
        const eventDetail = { status: 'success', formId: $form.id };
        const formSuccessEvent = new CustomEvent('formSubmissionSuccess', {
          detail: eventDetail,
        });
        document.dispatchEvent(formSuccessEvent);

        setTimeout(() => {
          successPopup.close();
          if (!isInPopup && overlay) {
            overlay.classList.remove('active');
            unlockDocument('form-success');
          }
        }, 3000);

        onSuccess && onSuccess();
      },
      fields: {
        name: {
          inputWrapper: new SexyInput({
            animation: 'none',
            $field: formRef.querySelector('[data-field-name]'),
            typeInput: 'name',
          }),
          rule: yup.string().required(i18next.t('required')).trim(),
          defaultMessage: i18next.t('name'),
          valid: false,
          error: [],
        },
        phone: {
          inputWrapper: new SexyInput({
            animation: 'none',
            $field: formRef.querySelector('[data-field-phone]'),
            typeInput: 'phone',
          }),
          rule: yup
            .string()
            .required(i18next.t('required'))
            .test('phone-validation', i18next.t('field_too_short', { cnt: 10 }), function (value) {
              if (!value) return false;

              // Remove all non-digit characters to get actual phone digits

              const digitsOnly = value.replace(/\D/g, '');

              // Most international phone numbers should have at least 10 digits (excluding country code)
              // The dialCode length varies, but phone numbers generally need 10+ digits to be valid
              return digitsOnly.length >= 10;
            }),

          defaultMessage: i18next.t('phone'),
          valid: false,
          error: [],
        },
      },
    },
  });
};
