"use client";

import { useState } from "react";

export default function TextInputForm({ onSubmit, isLoading = false }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='textInput'>Enter text to speak:</label>
          <textarea
            id='textInput'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type something here...'
            className='border-2 w-full'
            rows='4'
            disabled={isLoading}
          />
        </div>

        <div>
          <button
            type='submit'
            disabled={isLoading || !text.trim()}
            className='border-2 p-2'
          >
            {isLoading ? (
              <>
                <span className='animate-spin'>⏳</span>
                Processing...
              </>
            ) : (
              <>🔊 Speak Text</>
            )}
          </button>

          <button
            type='button'
            onClick={handleClear}
            disabled={isLoading}
            className='border-2 p-2'
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
