// app/actions/suggestions.ts

const mockHashtags = [
  "javascript",
  "react",
  "nextjs",
  "typescript",
  "tailwindcss",
];
const mockUsers = ["john", "jane", "doe", "smith", "admin"];

export async function getSuggestions(query: string, type: string) {
  const data = type === "hashtag" ? mockHashtags : mockUsers;
  const suggestions = data.filter((item) => item.includes(query));
  return suggestions.map((name, index) => ({ id: index.toString(), name }));
}
