export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: 'js' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'c++', label: 'C++', ext: 'cpp' },
  { id: 'c', label: 'C', ext: 'c' },
  { id: 'c#', label: 'C#', ext: 'cs' },
  { id: 'go', label: 'Go', ext: 'go' },
  { id: 'rust', label: 'Rust', ext: 'rs' },
  { id: 'php', label: 'PHP', ext: 'php' },
  { id: 'ruby', label: 'Ruby', ext: 'rb' },
  { id: 'kotlin', label: 'Kotlin', ext: 'kt' },
  { id: 'swift', label: 'Swift', ext: 'swift' },
  { id: 'sql', label: 'SQL', ext: 'sql' },
  { id: 'html', label: 'HTML', ext: 'html' },
  { id: 'css', label: 'CSS', ext: 'css' },
  { id: 'bash', label: 'Bash', ext: 'sh' }
];

export const extFor = (id) => LANGUAGES.find((l) => l.id === id)?.ext || 'txt';
