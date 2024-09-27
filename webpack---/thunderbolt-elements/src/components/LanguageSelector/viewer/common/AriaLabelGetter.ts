export function getAriaLabel(defaultAriaLabel: string, label: string) {
  return defaultAriaLabel.replace('{{language}}', label);
}
