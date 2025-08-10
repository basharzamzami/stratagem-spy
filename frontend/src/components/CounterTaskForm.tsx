import React, { useState } from "react";
import { useCreateCounterTask } from "../hooks/useCreateCounterTask";

export function CounterTaskForm({ adId, onSuccess }: { adId: string; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(2);
  const [description, setDescription] = useState("");
  const mutation = useCreateCounterTask(adId);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate(
      { title, priority, description: description.trim() || undefined },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 p-3 bg-white rounded border">
      <div className="text-sm font-medium mb-2">Create Counter Task</div>
      <div className="space-y-2">
        <label className="block text-sm">
          <span className="text-slate-600">Title</span>
          <input aria-label="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full border rounded px-2 py-1" />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Priority</span>
          <select aria-label="Priority" value={priority} onChange={(e) => setPriority(parseInt(e.target.value))} className="mt-1 w-full border rounded px-2 py-1">
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Description</span>
          <textarea aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" rows={3} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button disabled={mutation.isPending} type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50">{mutation.isPending ? "Creating..." : "Create"}</button>
        {mutation.isError && <div className="text-red-600 text-sm">Failed to create</div>}
        {mutation.isSuccess && <div className="text-green-600 text-sm">Created</div>}
      </div>
    </form>
  );
}

export default CounterTaskForm;

