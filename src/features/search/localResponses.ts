const mathsResponses = [
  'A grown adult outsourcing arithmetic to a decorative search bar. Ambitious.',
  'Those numbers are doing their best. You should consider joining them.',
  'An equation! At last, a question with fewer excuses than usual.',
  'I see you have brought mathematics into this. Bold, given the circumstances.',
  'That calculation is between you, a pencil, and several uncomfortable minutes.',
  'Excellent use of numerals. The next step is traditionally called “thinking.”',
  'Numbers again? They have suffered enough already.',
  'This is precisely why calculators look so tired.',
  'A mathematical question. Somewhere, a worksheet is waiting to be opened.',
  'Your keyboard has digits. Your brain has potential. Introduce them.',
  'I admire your confidence in asking me to do the part after reading the question.',
  'Math is just puzzles with better public relations. Give it a moment.',
  'Fascinating. You located the numbers but misplaced the effort.',
  'The answer is probably hiding exactly where you left your common sense.',
  'An impressive attempt to turn basic arithmetic into a team sport.',
  'This looks solvable, which is inconveniently different from your commitment to it.',
  'Good news: no one has outlawed doing the calculation yourself yet.',
  'A problem with numbers. Try the ancient ritual of writing down the steps.',
];

const generalResponses = [
  'You must know this by now. The confidence is genuinely inspiring, though.',
  'A magnificent question to ask instead of noticing the answer exists everywhere.',
  'Life must be exhausting when every fact requires a ceremonial summons.',
  'You had the internet, a functioning brain, and somehow chose this route.',
  'That is certainly a question. History will not be taking notes.',
  'The answer is out there, enjoying a peaceful life away from this conversation.',
  'Your curiosity is admirable. Its timing is less so.',
  'A bold request for information you could almost certainly have remembered.',
  'You have made the simple question feel like an administrative emergency.',
  'This is the sort of thing a fridge magnet might know.',
  'Remarkable. You found the question but skipped the part where you think about it.',
  'Somewhere, a textbook just sighed audibly.',
  'I respect the dedication to asking before attempting literally anything else.',
  'An excellent reminder that search engines have feelings too. Mostly fatigue.',
  'That fact was minding its own business until you brought it here.',
  'You are one determined follow-up away from making this somebody else’s problem.',
  'The answer is probably obvious. Which is why it has chosen not to make eye contact.',
  'I see the spirit of independent thought took the afternoon off.',
];

const followUpResponses = [
  'No, repeating it slowly did not make it more urgent.',
  'Ah, a follow-up. The original question clearly needed a sequel.',
  'We are still committed to this? Extraordinary.',
  'That clarification somehow made the situation even more educational for everyone else.',
  'You have returned with the same determination and none of the missing effort.',
  'A second attempt. Persistence is a quality. So is reflection.',
  'This conversation has context now, unfortunately for both of us.',
  'You remembered the previous question. Progress arrives in mysterious forms.',
];

const mathSignal = /\d|\b(add|subtract|multiply|divide|calculate|solve|equation|percent|percentage|fraction|square|cube|average|sum|product|math|maths)\b|[+*/=^%]/i;
const questionSignal = /\b(what|who|when|where|why|which|how|define|explain|capital|meaning|does|is|are|was|were)\b|\?$/i;

function pick(items: string[], seed: string) {
  const value = [...seed].reduce((total, character) => total + character.charCodeAt(0), 0);
  return items[value % items.length];
}

export function localSearchResponse(message: string, previousMessages: number) {
  if (previousMessages > 1 && /^(why|what|how|really|just|please|tell)/i.test(message.trim())) return pick(followUpResponses, message);
  if (mathSignal.test(message)) return pick(mathsResponses, message);
  if (questionSignal.test(message)) return pick(generalResponses, message);
  return pick(generalResponses, message);
}
