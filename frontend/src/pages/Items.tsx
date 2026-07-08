import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itemsService, Item } from '../services/itemsService';

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await itemsService.getAll());
    } catch {
      setError('Could not load items. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setBusy(true);
    setError(null);
    try {
      const created = await itemsService.create(name);
      setItems((prev) => [...prev, created]);
      setNewName('');
    } catch {
      setError('Could not create item.');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setEditingName(item.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName('');
  }

  async function handleSaveEdit(id: string) {
    const name = editingName.trim();
    if (!name) return;

    setBusy(true);
    setError(null);
    try {
      const updated = await itemsService.update(id, name);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      cancelEdit();
    } catch {
      setError('Could not update item.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this item?')) return;

    setBusy(true);
    setError(null);
    try {
      await itemsService.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError('Could not delete item.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Items</h1>
          <p className="page-subtitle">
            In-memory demo data, backed by the NestJS /items endpoint.
          </p>
        </div>
        <Link to="/" className="link-back">
          &larr; Home
        </Link>
      </div>

      <form className="item-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="New item name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={busy}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={busy || !newName.trim()}
        >
          Add Item
        </button>
      </form>

      {error && <div className="banner banner-error">{error}</div>}

      <div className="items-card">
        <div className="items-card-header">
          <span>
            Name <span className="items-count">({items.length})</span>
          </span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="items-empty">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="items-empty">No items yet. Add one above.</div>
        ) : (
          <ul className="items-list">
            {items.map((item) => (
              <li key={item.id} className="items-row">
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                      disabled={busy}
                    />
                    <div className="items-row-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={busy || !editingName.trim()}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={cancelEdit}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="items-name">
                      <span>{item.name}</span>
                      <span className="items-id">{item.id}</span>
                    </div>
                    <div className="items-row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => startEdit(item)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
