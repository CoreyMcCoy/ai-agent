'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
  });
  const { name, instructions } = formData;
  const [assistant, setAssistant] = useState({});
  const [messages, setMessages] = useState('');

  const createAgent = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch('api/create', {
      method: 'POST',
      body: JSON.stringify({ name, instructions }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessages(data.message);
      return;
    } else {
      setMessages(data.message);
    }

    setAssistant(data.assistant);

    setFormData({
      name: '',
      instructions: '',
    });
  };

  useEffect(() => {
    toast.success(messages);
  }, [assistant]);

  return (
    <>
      <h1 className="text-xl font-medium mb-8">AI Agent Practice</h1>
      <form onSubmit={createAgent} className="flex flex-col space-y-3">
        <label>Agent Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        {/* Describe the functionality */}
        <label>Instructions</label>
        <textarea
          type="text"
          className="textarea textarea-bordered w-full"
          value={instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">
          Create an agent
        </button>
      </form>
    </>
  );
}
