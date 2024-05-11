'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
  });
  const { name, instructions } = formData;
  const [messages, setMessages] = useState('');
  const [assistant, setAssistant] = useState({});
  const [myAssistants, setMyAssistants] = useState([]);
  const [singleAssistant, setSingleAssistant] = useState({
    id: '',
  });
  const { id = '' } = singleAssistant || {};

  // Fetch a single assistant
  const getAgent = async (e) => {
    e.preventDefault();
    const response = await fetch(`api/assistant?id=${id}`);
    const data = await response.json();

    if (!response.ok) {
      setMessages(data.message);
      return;
    } else {
      setMessages(data.message);
    }

    setAssistant(data.assistant);

    setSingleAssistant({
      id: '',
    });
  };

  // Fetch all the assistants
  const listAgents = async (e) => {
    e.preventDefault();
    const response = await fetch('api/assistant');
    const data = await response.json();

    if (!response.ok) {
      setMessages(data.message);
      return;
    } else {
      setMessages(data.message);
    }

    setMyAssistants(data.assistants);
    // Save to local storage
    localStorage.setItem('assistants', JSON.stringify([...data.assistants]));
  };

  // Create an assistant
  const createAgent = async (e) => {
    e.preventDefault();
    const response = await fetch('api/assistant', {
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
  }, [assistant, myAssistants, messages]);

  return (
    <>
      <h1 className="text-xl font-medium mb-8">AI Agent Practice</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="w-5/6 flex flex-col gap-4">
          <div className="card card-body bg-base-200">
            <h3 className="card-title text-lg font-medium mb-5">Create an Assistant</h3>
            <form onSubmit={createAgent} className="flex flex-col space-y-3">
              <label>Name</label>
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
          </div>

          <div className="card card-body bg-base-200">
            <h3 className="card-title text-lg font-medium mb-3">Get all Assistants</h3>
            <form onSubmit={listAgents} className="flex flex-col">
              <button type="submit" className="btn btn-primary">
                Get all agents
              </button>
            </form>
            <div className="flex flex-col">
              {myAssistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className="card card-body bg-base-300 flex flex-col mt-3 space-y-1 text-sm"
                >
                  <p>Name: {assistant.name}</p>
                  <p>ID: {assistant.id}</p>
                  <p>Instructions: {assistant.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-5/6">
          <div className="card card-body bg-base-200">
            <h3 className="card-title text-lg font-medium mb-5">Get a single Assistant</h3>
            <form onSubmit={getAgent} className="flex flex-col space-y-3">
              <label>Agent ID</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={id}
                onChange={(e) => setSingleAssistant({ ...singleAssistant, id: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-primary">
                Get an agent
              </button>
            </form>
            <div className="card card-body bg-base-300 flex flex-col mt-3 space-y-1 text-sm">
              <p>Name: {assistant.name}</p>
              <p>ID: {assistant.id}</p>
              <p>Instructions: {assistant.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
