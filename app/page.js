'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    id: '',
    chat: '',
  });
  const { name, instructions, id, chat } = formData;
  const [messages, setMessages] = useState('');
  const [assistant, setAssistant] = useState({});
  const [myAssistants, setMyAssistants] = useState([]);
  const [thread, setThread] = useState('');
  const [chatResponse, setChatResponse] = useState([]);

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

    setFormData({
      id: '',
      name: '',
      instructions: '',
    });
  };

  // Get all the assistants
  const listAgents = async (e) => {
    e.preventDefault();
    const response = await fetch('api/assistant/get');
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
      id: '',
    });
  };

  // Create a thread
  const createThread = async (e) => {
    e.preventDefault();
    console.log('Creating a thread');
    const response = await fetch('api/threads', {
      method: 'POST',
    });
    const data = await response.json();

    if (!response.ok) {
      setMessages(data.message);
      return;
    } else {
      setMessages(data.message);
    }

    setThread(data.thread.id);

    // Save to local storage
    localStorage.setItem('thread', JSON.stringify(data.thread.id));
  };

  // Create a chat
  const createChat = async (e) => {
    e.preventDefault();
    console.log(chat);

    // Get the thread from local storage
    const thread = JSON.parse(localStorage.getItem('thread'));
    console.log(thread);

    const response = await fetch(`api/messages?thread=${thread}`, {
      method: 'POST',
      body: JSON.stringify({ chat }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessages(data.message);
      return;
    } else {
      setMessages(data.message);
    }

    setChatResponse(data.message);

    setFormData({
      chat: '',
      name: '',
      instructions: '',
      id: '',
    });
  };

  // Run a thread
  const runThread = async (e) => {
    e.preventDefault();
    console.log('Running a thread');

    // Get the thread from local storage
    const thread = JSON.parse(localStorage.getItem('thread'));
    console.log(thread);

    // Get the assistant id from local storage
    const assistants_id = JSON.parse(localStorage.getItem('assistants'));
    console.log(assistants_id[0].id);

    const response = await fetch(`api/run?thread=${thread}`, {
      method: 'POST',
      body: JSON.stringify({ assistants_id: assistants_id[0].id }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessages(data.message);
      return;
    } else {
      setMessages(data.message);
    }
  };

  useEffect(() => {
    toast.success(messages);
  }, [assistant, myAssistants, messages, thread]);

  return (
    <>
      <h1 className="text-xl font-medium mb-8">AI Agent Practice</h1>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
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
                </div>
              ))}
            </div>
          </div>
          <div className="card card-body bg-base-200">
            <h3 className="card-title text-lg font-medium mb-5">Get a single Assistant</h3>
            <form onSubmit={getAgent} className="flex flex-col space-y-3">
              <label>Agent ID</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-primary">
                Get an agent
              </button>
            </form>
            <div className="card card-body bg-base-300 flex flex-col mt-3 space-y-1 text-sm">
              <p>Name: {assistant.name}</p>
              <p>Instructions: {assistant.instructions}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-body bg-base-200 mb-6">
            <h3 className="card-title text-lg font-medium mb-3">Create a thread</h3>
            <form onSubmit={createThread} className="flex flex-col">
              <button type="submit" className="btn btn-primary">
                Create a thread
              </button>
            </form>
            <div className="flex flex-col">
              <div className="card card-body bg-base-300 flex flex-col mt-3 space-y-1 text-sm">
                <p>Thread: {thread}</p>
              </div>
            </div>
          </div>
          <div className="card card-body bg-base-200 mb-6">
            <h3 className="card-title text-lg font-medium mb-3">Run a thread</h3>
            <form onSubmit={runThread} className="flex flex-col">
              <button type="submit" className="btn btn-primary">
                Create a thread
              </button>
            </form>
          </div>
          <div className="card card-body bg-base-200">
            <h3 className="card-title text-lg font-medium mb-5">Chat with Assistant</h3>
            <form onSubmit={createChat} className="flex flex-col space-y-3">
              <label>
                <textarea
                  type="text"
                  className="textarea textarea-bordered w-full"
                  value={chat}
                  onChange={(e) => setFormData({ ...formData, chat: e.target.value })}
                  required
                ></textarea>
              </label>
              <button type="submit" className="btn btn-primary">
                Chat
              </button>
            </form>
            <div className="card card-body bg-base-300 flex flex-col mt-3 space-y-1 text-sm">
              <p>Chat: {chatResponse}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
