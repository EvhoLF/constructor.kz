type granularityType = 'month' | 'day' | 'hour' | 'minute' | 'seconds' | 'full';

export const generateData = (granularity: granularityType = 'full', separator = '') => {
  const date = new Date();

  const components = [
    (date.getFullYear() % 100).toString().padStart(2, '0'), // последние 2 цифры года
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0'),
    date.getMilliseconds().toString().padStart(3, '0'),
  ];
  const granularityMap = { month: 2, day: 3, hour: 4, minute: 5, seconds: 6, full: 7, };

  return components.slice(0, granularityMap[granularity] ?? granularityMap.full).join(separator)
}
type generateUniqueId = {
  before?: string,
  after?: string,
  granularity?: granularityType,
  separator?: string,
}
export const generateUniqueId = ({ before = '', after = '', granularity = 'full', separator = '' }: generateUniqueId = {}) => {
  return [before.toString(), ...generateData(granularity), after.toString()].join(separator);
}

export const generateUnique = () => Date.now().toString();