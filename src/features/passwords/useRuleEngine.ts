import { useEffect, useMemo, useState } from 'react';
import { passwordRules, type PasswordRule } from './rules';

export function useRuleEngine(password: string) {
  const [unlockedCount, setUnlockedCount] = useState(5);
  const visibleRules = useMemo(() => passwordRules.slice(0, unlockedCount), [unlockedCount]);
  const satisfied = useMemo(() => new Map(visibleRules.map((rule) => [rule.id, rule.validate(password)])), [password, visibleRules]);
  const completed = [...satisfied.values()].filter(Boolean).length;
  const allVisibleSatisfied = visibleRules.length > 0 && completed === visibleRules.length;

  useEffect(() => {
    if (allVisibleSatisfied && unlockedCount < passwordRules.length) {
      const timer = window.setTimeout(() => setUnlockedCount((count) => count + 1), 420);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [allVisibleSatisfied, unlockedCount]);

  return { visibleRules, satisfied, completed, unlockedCount, allVisibleSatisfied, totalRules: passwordRules.length };
}

export type RuleValidation = Pick<PasswordRule, 'id' | 'description' | 'stage'>;
