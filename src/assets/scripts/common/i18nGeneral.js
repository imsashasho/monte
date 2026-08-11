import i18next from 'i18next';
import { langDetect } from '../../../assets/scripts/modules/helpers/helpers';
/*  */
const lang = langDetect();
(async () => {
  await i18next.init({
    // lng: lang, // Текущий язык
    lng: lang, // Текущий язык
    // debug: true,
    // returnObjects: true,
    resources: {
      uk: {
        // Текст на мові по замовчуванню
        translation: {
          // namespace по замовчуванню
          name: 'Ім’я:*',
          phone: 'Телефон:*',
          send: 'Залишити заявку',
          sending: 'Відправлення',
          field_too_short: 'Телефон має містити принаймні {{cnt}} символів',
          field_too_long: 'Телефон має містити не більше {{cnt}} символів',
          only_number: 'Тут лише цифри',
          required: 'Це поле є обов’язковим',
          sendingSuccessTitle: 'Повідомлення надіслано',
          sendingSuccessText: 'Чекайте відповіді наших менеджерів',
          sendingErrorText: 'Чекайте відповіді наших менеджерів',

          sendingErrorTitle: 'Сталася помилка',
          send_fail:
            'Повідомлення не було відправлено через невідому помилку сервера. Код: [send_fail] ',
          invalid_form:
            'Повідомлення не було відправлено через невідому помилку сервера. Код: [invalid_form] ',
          front_error:
            'Повідомлення не було відправлено через невідому помилку сервера. Код: [front_error] ',
          invalid_upload_file: 'Помилка завантаження файлу. Код: [invalid_upload_file]',
          invalid_recaptcha: 'Заповніть капчу і спробуйте ще раз знову. Код: [invalid_recaptcha]',
          connectionFailed: 'Помилка з’єднання с CRM',
          card: 'card',
          send: 'Залишити заявку',
        },
      },
      en: {
        // Тексты конкретного языка
        translation: {
          // Default namespace
          name: 'Name:*',
          phone: 'Phone:*',
          sent: 'YOUR MESSAGE HAS BEEN SENT',
          sending: 'Sending',
          field_too_short: 'Must contain at least {{cnt}} characters',
          field_too_long: 'Phone number must contain no more than {{cnt + 2}} characters',
          only_number: 'Only numbers are allowed here',
          required: 'This field is required',
          sendingSuccessTitle: 'Message Sent',
          sendingSuccessText: 'Wait for a response from our managers',
          sendingErrorText: 'Wait for a response from our managers',
          sendingErrorTitle: 'An Error Occurred',
          send_fail: 'The message was not sent due to an unknown server error. Code: [send_fail]',
          invalid_form:
            'The message was not sent due to an unknown server error. Code: [invalid_form]',
          front_error:
            'The message was not sent due to an unknown server error. Code: [front_error]',
          invalid_upload_file: 'File upload error. Code: [invalid_upload_file]',
          invalid_recaptcha: 'Complete the captcha and try again. Code: [invalid_recaptcha]',
          connectionFailed: 'CRM connection error',
          card: 'card',
          send: 'SUBMIT',
          failed: 'SENDING FAILED',
        },
      },
    },
  });
})();
