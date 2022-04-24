export const time24hRegex = new RegExp(/^([01]\d|2[0-3]):([0-5]\d)$/);
export const time12hRegex = new RegExp(
  /^(0?[0-9]|1[012]):[0-5][0-9] ?((a|p|A|P)m|(a|p|A|P)M)$/
);

export const errorIcon = '❌';
export const noDelayOrTimeErrorMessage = `${errorIcon} Please define a delay (e.g. 1h30m) or a specific time (e.g. 16:20) for your reminder`;
export const noMessageErrorMessage = `${errorIcon} Please define a message for your reminder`;
export const noPastTimeErrorMessage = `${errorIcon} The reminder time can't be in the past`;
