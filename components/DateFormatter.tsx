interface DateFormatterProps {
  dateString: string;
  className?: string;
  showTime?: boolean;
}

export default function DateFormatter({
  dateString,
  className = '',
  showTime = false
}: DateFormatterProps) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedDateTime = showTime
    ? date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : formattedDate;

  return (
    <time
      dateTime={dateString}
      className={className}
    >
      {formattedDateTime}
    </time>
  );
}