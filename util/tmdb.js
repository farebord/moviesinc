import config from "../config";

export const fetchTmdb = async (url, extra = {}, session, lang = "es-ES") => {
  const response = await fetch(
    `${url}?${lang ? `language=${lang}&` : ""}${
      session ? `session_id=${session}&` : ""
    }`,
    {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${config.tmdbApiKey}`,
      },
      ...extra,
    }
  );
  return response;
};
