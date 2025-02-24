export const api: any = {
  get: async (route: string): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;
    return await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Network response was not ok: ${res.status} - ${text.slice(0, 100)}...`);
        }
        const json = await res.json();
        return {
          data: json,
          status: res.status,
        };
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        throw err;
      });
  },

  post: async (route: string, payload: any): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Proper header for JSON
      },
      body: JSON.stringify(payload), // Stringify the payload
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await res.json();
        return {
          data: json,
          status: res.status,
        };
      })
      .catch((err) => {
        console.error("Error posting data: ", err);
        throw err;
      });
  },

  put: async (route: string, data: any): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    return await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then(async (res) => {
        const json = await res.json();
        const response = {
          data: json,
          status: res.status,
        };
        return response;
      })
      .catch((err) => {
        console.error("Error posting data: ", err);
        throw err;
      });
  },

  delete: async (route: string, data: any): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    return await fetch(url, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await res.json();
        const response = {
          data: json,
          status: res.status,
        };

        return response;
      })
      .catch((err) => {
        console.error("Error deleting data: ", err);
        throw err;
      });
  }
};
