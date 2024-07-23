// components/TextArea.tsx
import React, { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { getSuggestions } from "../actions/getSuggestions";
import { Card } from "@/components/ui/card";

interface Suggestion {
  id: string;
  name: string;
}

const TextArea: React.FC = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchSuggestions = debounce(async (query: string) => {
    if (symbol) {
      try {
        const data = await getSuggestions(
          query,
          symbol === "#" ? "hashtag" : "user"
        );
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    }
  }, 300);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setText(value);

    const cursorPosition = event.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/[#@][a-zA-Z0-9_]*$/);

    if (match) {
      const activationSymbol = match[0][0];

      const query = match[0].slice(1);
      setSymbol(activationSymbol);
      fetchSuggestions(query);
    } else {
      setShowSuggestions(false);
      setSymbol(null);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (symbol && textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textBeforeCursor = text.slice(0, cursorPosition);
      const textAfterCursor = text.slice(cursorPosition);
      const match = textBeforeCursor.match(/[#@][a-zA-Z0-9_]*$/);

      if (match) {
        const query = match[0];
        const newText =
          textBeforeCursor.replace(query, `${symbol}${suggestion.name} `) +
          textAfterCursor;
        setText(newText);
        setShowSuggestions(false);
        setSymbol(null);
        textareaRef.current.focus();
      }
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false);
          }, 200);
        }}
        ref={textareaRef}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        value={text}
        onChange={handleInput}
        placeholder="Type something..."
      />
      {showSuggestions && (
        <div className="absolute bg-white shadow-lg border border-gray-200 rounded-md mt-1 w-full max-h-60 overflow-y-auto z-10">
          <Card>
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  #{suggestion.name}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TextArea;
