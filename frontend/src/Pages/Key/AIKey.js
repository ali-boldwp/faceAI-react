import React, { useState } from "react";

const AIKey = () => {
  const [key, setKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Your OpenAI Key: ${key}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">OpenAI Key</h2>

        <div className="mb-6 text-left">
          <label
            htmlFor="apiKey"
            className="block text-gray-700 font-semibold mb-2"
          >
            Enter Your OpenAI Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxxxx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AIKey;
