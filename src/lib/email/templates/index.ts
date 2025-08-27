export type { IBaseTemplateData } from "./base-template";
export {
  createButton,
  createInfoRow,
  createMessageBox,
  createTimestamp,
  formatMessage,
  getDividerElement,
  render,
} from "./base-template";
export { getTemplateConfig } from "./config";
export {
  createAdminNotificationHtml as createContactAdminHtml,
  createAdminNotificationText as createContactAdminText,
  createUserConfirmationHtml as createContactUserHtml,
  createUserConfirmationText as createContactUserText,
} from "./contact-templates";
export {
  createAdminNotificationHtml as createResumeAdminHtml,
  createAdminNotificationText as createResumeAdminText,
  createUserConfirmationHtml as createResumeUserHtml,
  createUserConfirmationText as createResumeUserText,
} from "./resume-templates";
