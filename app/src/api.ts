export const api: any = {
  get: async (route: string): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      return {
        data: json,
        status: response.status,
      };
    } catch (err) {
      console.error(`Failed to fetch ${route}:`, err);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        console.error(
          "Backend server may not be running. Please check if the server is started at",
          process.env.REACT_APP_API_URL,
        );
      }
      throw err;
    }
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

  patch: async (route: string, payload: any): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    return await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        console.error("Error patching data: ", err);
        throw err;
      });
  },

  put: async (route: string, payload: any): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    return await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        console.error("Error putting data: ", err);
        throw err;
      });
  },

  delete: async (route: string, data: any): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL as string}${route}`;

    return await fetch(url, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
        mode: "no-cors",
      },
      body: data,
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
  },
};
