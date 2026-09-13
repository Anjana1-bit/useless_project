export type RuleStage = 'foundation' | 'annoying' | 'ridiculous' | 'absurd';

export interface PasswordRule {
  id: string;
  description: string;
  stage: RuleStage;
  validate: (password: string) => boolean;
}

const includesAny = (values: string[]) => (password: string) =>
  values.some((value) => password.toLowerCase().includes(value));

const hasPalindrome = (password: string) => {
  const letters = password.toLowerCase().replace(/[^a-z]/g, '');
  for (let index = 0; index < letters.length - 2; index += 1) {
    const fragment = letters.slice(index, index + 3);
    if (fragment === fragment.split('').reverse().join('')) return true;
  }
  return false;
};

export const passwordRules: PasswordRule[] = [
  { id: 'length', description: 'At least 8 characters', stage: 'foundation', validate: (value) => value.length >= 8 },
  { id: 'uppercase', description: 'Contains an uppercase letter', stage: 'foundation', validate: (value) => /[A-Z]/.test(value) },
  { id: 'lowercase', description: 'Contains a lowercase letter', stage: 'foundation', validate: (value) => /[a-z]/.test(value) },
  { id: 'number', description: 'Contains a number', stage: 'foundation', validate: (value) => /\d/.test(value) },
  { id: 'symbol', description: 'Contains a special character', stage: 'foundation', validate: (value) => /[^A-Za-z0-9]/.test(value) },
  { id: 'country', description: 'Contains a country name', stage: 'annoying', validate: includesAny(['india', 'canada', 'japan', 'brazil', 'france', 'italy', 'mexico', 'australia']) },
  { id: 'month', description: 'Contains a month', stage: 'annoying', validate: includesAny(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']) },
  { id: 'palindrome', description: 'Contains a 3-letter palindrome', stage: 'annoying', validate: hasPalindrome },
  { id: 'roman', description: 'Contains a Roman numeral', stage: 'ridiculous', validate: (value) => /(?:^|[^A-Za-z])[IVXLCDM]+(?:$|[^A-Za-z])/i.test(value) },
  { id: 'math', description: 'Contains a mathematical symbol', stage: 'ridiculous', validate: (value) => /[+−×÷=√∑π]/.test(value) },
  { id: 'planet', description: 'Contains the name of a planet', stage: 'ridiculous', validate: includesAny(['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']) },
  { id: 'three-digits', description: 'Contains exactly 3 numbers', stage: 'ridiculous', validate: (value) => (value.match(/\d/g) ?? []).length === 3 },
  { id: 'prime', description: 'Contains a prime number', stage: 'absurd', validate: (value) => /(?:2|3|5|7|11|13|17|19|23|29|31)(?!\d)/.test(value) },
  { id: 'backward-password', description: 'Contains “password” backwards', stage: 'absurd', validate: (value) => value.toLowerCase().includes('drowssap') },
  { id: 'seventeen', description: 'Is exactly 17 characters long', stage: 'absurd', validate: (value) => value.length === 17 },
  { id: 'twenty-word', description: 'Contains a 20-character word', stage: 'absurd', validate: (value) => /[A-Za-z]{20}/.test(value) },
  { id: 'self', description: 'Contains the password itself', stage: 'absurd', validate: () => false }
];
