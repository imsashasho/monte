import Cleave from 'cleave.js';
import intlTelInput from 'intl-tel-input';

export default class SexyInput {
  constructor(setting) {
    this.selected = false;
    this.$field = setting.$field;
    this.$input = setting.$input || setting.$field.querySelector('input');
    this.typeInput = setting.typeInput || 'text';
    this.animation = setting.animation || 'none';
    this.$message = setting.$message || setting.$field.querySelector('[data-input-message]');

    this.$body = document.querySelector('body');

    this.init();
  }

  get input() {
    return this.$input;
  }

  selectIn(self) {
    return () => {
      if (this.getStatusField() !== 'field--error') {
        self.showSelectedStyle();
        self.addSelectedStyle();
      }
    };
  }

  selectOut(self) {
    return ({ target }) => {
      if (this.getStatusField() === 'field--error' || target.value !== '') return;

      self.showDefaultStyle();
      self.removeSelectedStyle();
    };
  }

  /*  */
  getStatusField() {
    return this.$field.getAttribute('data-status');
  }

  /*  */
  showSuccessStyle() {
    this.changeStatus(this.$field, 'success');
  }

  showDefaultStyle() {
    this.changeStatus(this.$field, 'default');
  }

  showErrorStyle() {
    this.changeStatus(this.$field, 'error');
  }

  showSelectedStyle() {
    this.changeStatus(this.$field, 'selected');
  }

  showLoadingStyle() {
    this.changeStatus(this.$field, 'loading');
  }

  addSelectedStyle() {
    if (this.animation === 'focus') {
      this.$field.classList.add('selected');
    }
  }

  removeSelectedStyle() {
    this.$field.classList.remove('selected');
  }

  writeMessage(text) {
    this.$message.innerHTML = text;
  }
  /*  */

  changeStatus(fieldBlock, status) {
    switch (status) {
      case 'default':
        fieldBlock.classList.remove('selected');
        fieldBlock.setAttribute('data-status', 'field--inactive');

        break;
      case 'success':
        fieldBlock.setAttribute('data-status', 'field--success');

        break;
      case 'error':
        fieldBlock.setAttribute('data-status', 'field--error');
        break;
      case 'selected':
        fieldBlock.classList.add('selected');
        fieldBlock.setAttribute('data-status', 'field--active');
        break;
      case 'loading':
        fieldBlock.classList.add('selected');
        fieldBlock.setAttribute('data-status', 'field--loading');
        break;

      default:
        throw new Error(`Unknown change status ${status}`);
    }
  }

  listeners(input) {
    const self = this;

    if (this.typeInput === 'phone') {
      /* eslint-disable */
      input.setAttribute('inputmode', 'tel');
      input.intTelIput = intlTelInput(input, {
        preferredCountries: ['ua'],
        autoPlaceholder: 'off',
      });

      const mask = '+380 (__) ___-__-__';
      let cleave = null;

      // Функція для пошуку першого вільного підкреслення
      const setCursorToPlaceholder = () => {
        const firstPlaceholder = input.value.indexOf('_');
        if (firstPlaceholder !== -1) {
          input.setSelectionRange(firstPlaceholder, firstPlaceholder);
        }
      };

      // Функція для кастомної маски України (пази нікуди не зникають)
      const handleUkraineMask = (e) => {
        let matrix = mask;
        let i = 0;
        let val = input.value.replace(/\D/g, '');

        // Якщо користувач намагається стерти код країни, повертаємо дефолт
        if (val.length < 3) {
          val = '380';
        }

        input.value = matrix.replace(/./g, (a) => {
          if (/[_\d]/.test(a) && i < val.length) {
            return val.charAt(i++);
          } else if (i >= val.length) {
            return '_';
          }
          return a;
        });

        setCursorToPlaceholder();
      };

      // Функція повного повернення до початкового стану маски
      const resetToDefaultState = () => {
        input.value = mask;
        if (cleave) {
          cleave.destroy();
          cleave = null;
        }
      };

      // Ініціалізація стартового стану для України
      if (!input.value || input.value === '+380 (') {
        input.value = mask;
      }

      input.addEventListener('input', handleUkraineMask);

      // При фокусі ставимо курсор на перше підкреслення
      input.addEventListener('focus', () => {
        setTimeout(setCursorToPlaceholder, 10);
      });

      // Перехоплюємо клік мишки, щоб курсор не стрибав куди завгодно
      input.addEventListener('click', () => {
        setCursorToPlaceholder();
      });

      input.addEventListener('keydown', (e) => {
        if (input.value === mask && e.key === 'Backspace') {
          e.preventDefault();
        }
      });

      // СЛУХАЧ СКИДАННЯ ФОРМИ: коли FormMonster викличе reset(), повертаємо маску
      const parentForm = input.closest('form');
      if (parentForm) {
        parentForm.addEventListener('reset', () => {
          setTimeout(resetToDefaultState, 10);
        });
      }

      document.querySelectorAll('.iti__country-list').forEach((element) => {
        element.setAttribute('data-lenis-prevent', '');
      });

      input.addEventListener('countrychange', () => {
        const currentCountry = input.intTelIput.getSelectedCountryData();
        const { dialCode } = currentCountry;
        const selfInput = input;

        // Очищаємо попередні слухачі та плагіни
        if (cleave) {
          cleave.destroy();
          cleave = null;
        }
        input.removeEventListener('input', handleUkraineMask);
        selfInput.value = '';

        // Якщо обрали Україну — вмикаємо залізобетонні пази
        if (currentCountry.iso2 === 'ua') {
          selfInput.value = mask;
          input.addEventListener('input', handleUkraineMask);
          return;
        }

        // Для інших країн лишаємо звичайний Cleave без пазів
        let maskPart = 3;
        switch (currentCountry.iso2) {
          case 'us':
          case 'kz':
            maskPart = 3;
            break;
          case 'ae':
            maskPart = 2;
            break;
          default:
            maskPart = 3;
            break;
        }

        cleave = new Cleave(input, {
          numericOnly: true,
          prefix: `+${dialCode} (`,
          tailPrefix: true,
          blocks: [dialCode.toString().length + 2, maskPart, 3, 2, 2],
          delimiters: ['', ') ', '-', '-'],
        });
      });
    }

    if (this.animation === 'focus') {
      input.addEventListener('focus', self.selectIn(self));
      input.addEventListener('blur', self.selectOut(self));
    }
  }

  prepareMarkup() {
    if (this.animation === 'focus') {
      this.$field.setAttribute('data-animation', 'focus');
    }
    if (this.animation === 'none') {
      this.$field.setAttribute('data-animation', 'none');
    }
  }

  init() {
    this.listeners(this.$input);
    this.prepareMarkup(this.$input);
  }
}
