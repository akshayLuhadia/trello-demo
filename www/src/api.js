exports.execute = async function (resource, method, headers = {}, body = null) {
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${resource}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
  return null;
};
