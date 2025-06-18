export const onRequest: PagesFunction<Env> = async (context) => {
  const value = await context.env.ASSETS.fetch("trait-blue-aura_aura")
  console.log("Fetched value:", value);
  return new Response(value);
};