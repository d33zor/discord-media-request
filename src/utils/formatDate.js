export default function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
