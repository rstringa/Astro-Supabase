import {
  createResource,
  For,
  ErrorBoundary,
  createSignal,
  type ResourceFetcher,
  type JSX,
} from "solid-js";

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
}

const fetcher: ResourceFetcher<boolean, GuestbookEntry[], unknown> = async (_,) => {
  const res = await fetch("/api/guestbook", {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export function Reviews({ reviews }: { reviews: GuestbookEntry[] }) {
  const [data, { refetch }] = createResource(true, fetcher, {
    initialValue: reviews,
    ssrLoadFrom: "initial",
  });

  const [editingId, setEditingId] = createSignal<number | null>(null);

  const onSubmitHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const name = formData.get("name")?.toString();
    const message = formData.get("message")?.toString();

    if (!name || !message) return;

    const res = await fetch("/api/guestbook", {
      method: "POST",
      body: JSON.stringify({ name, message }),
    });

    if (res.ok) {
      formElement.reset();
      refetch();
    } else {
      console.error("Failed to add entry");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/guestbook", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });

    if (res.ok) {
      refetch();
    } else {
      console.error("Failed to delete entry");
    }
  };

  const handleEdit = async (id: number, newMessage: string) => {
    const res = await fetch("/api/guestbook", {
      method: "PUT",
      body: JSON.stringify({ id, message: newMessage }),
    });

    if (res.ok) {
      setEditingId(null);
      refetch();
    } else {
      console.error("Error al editar la entrada");
    }
  };

  return (
    <div class="max-w-3xl w-full">
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <form
          onsubmit={onSubmitHandler}
          class="block border bg-blue-100 border-blue-300 rounded-md p-6 dark:bg-blue-950 dark:border-blue-800"
        >
          <div>
            <label
              class="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm"
              for="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Sam"
              required
              name="name"
              class="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
            />
          </div>
          <div class="mt-3">
            <label
              class="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm"
              for="message"
            >
              Message
            </label>
            <input
              id="message"
              type="text"
              class="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
              placeholder="A friendly message"
              required
              name="message"
            />
          </div>
          <button
            class="w-full dark:bg-zinc-100 bg-zinc-900 border-zinc-900 py-1.5 border dark:border-zinc-100 rounded-md mt-4 dark:text-zinc-900 text-zinc-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={data.loading}
          >
            Submit
          </button>
        </form>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <For each={data()}>
            {(review) => (
              <li class="p-4 border rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700">
                {editingId() === review.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const newMessage = (e.target as HTMLFormElement).message.value;
                    handleEdit(review.id, newMessage);
                  }}>
                    <input
                      type="text"
                      name="message"
                      value={review.message}
                      class="w-full mb-2 rounded-md py-1 px-3 dark:bg-zinc-700 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-600"
                    />
                    <button type="submit" class="text-blue-500 dark:text-blue-400 mr-2">Guardar</button>
                    <button type="button" onClick={() => setEditingId(null)} class="text-zinc-500 dark:text-zinc-400">Cancelar</button>
                  </form>
                ) : (
                  <>
                    <div class="float-right">
                      <a
                        class="text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 mr-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingId(review.id);
                        }}
                      >
                        Editar
                      </a>
                      <a
                        class="text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(review.id);
                        }}
                      >
                        Eliminar
                      </a>
                    </div>
                    <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {review.name}
                    </p>
                    <p class="mt-1">{review.message}</p>
                  </>
                )}
              </li>
            )}
          </For>
        </ul>
      </ErrorBoundary>
    </div>
  );
}