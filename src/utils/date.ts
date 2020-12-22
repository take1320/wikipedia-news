import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('ja');

export const fromNow = (date: Date): string => {
  dayjs.extend(relativeTime);

  return dayjs(date).fromNow();
};
