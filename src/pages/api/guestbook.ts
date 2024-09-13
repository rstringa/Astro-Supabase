import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: true });
  

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }
  
  return new Response(JSON.stringify(data));
};

export const POST: APIRoute = async ({ request }) => {
  const { name, message } = await request.json();
  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name, message })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};

export const DELETE: APIRoute = async ({ request }) => {
  const { id } = await request.json();
  const { data, error } = await supabase
    .from("guestbook")
    .delete()
    .match({ id: id })
    
    if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};

export const PUT: APIRoute = async ({ request }) => {
  const { id, name, message } = await request.json();
  const { data, error } = await supabase
    .from("guestbook")
    .update({ name, message })
    .eq('id', id)
    .select();

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};
