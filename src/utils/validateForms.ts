/* eslint-disable no-unused-vars */
import { RuleObject } from 'antd/lib/form'
import { NamePath } from 'antd/lib/form/interface'

export const validateMatchPasswords = (
  getFieldValue: (name: NamePath) => any,
  passwordField: NamePath,
) => ({
  validator(_: RuleObject, value: any) {
    if (!value || getFieldValue(passwordField) === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Пароли не совпадают!'))
  },
  validateTrigger: 'onSubmit',
})

export const validateRegexPassword = (
  getFieldValue: (name: NamePath) => any,
  passwordField: NamePath,
) => ({
  validator(_: RuleObject, value: any) {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
    if (regex.test(value) && regex.test(getFieldValue(passwordField))) {
      return Promise.resolve()
    }
    return Promise.reject(
      new Error(
        `Пароль должен содержать минимум 8 символов, 1 цифру, 1 заглавную букву и 1 прописную букву`,
      ),
    )
  },
  validateTrigger: 'onSubmit',
})
