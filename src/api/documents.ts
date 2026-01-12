// src/api/documents.ts
const API_URL = "http://localhost:3000/api/graphql";

export async function fetchDocuments() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query: `
        query {
          documents {
            id
            title
            content
            contentFile {
              url
            }
          }
        }
      `,
    }),
  });

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data.documents;
}

//  Save document with optional file upload
export async function createDocument(
  title: string,
  content: string,
  file?: File
) {
  if (file) {
    // Use FormData for file upload
    const formData = new FormData();
    
    const query = `
      mutation CreateDocument($title: String!, $content: String!, $contentFile: Upload!) {
        createDocument(data: { title: $title, content: $content, contentFile: { upload: $contentFile } }) {
          id
          title
          content
          contentFile {
            url
          }
        }
      }
    `;

    formData.append(
      "operations",
      JSON.stringify({
        query,
        variables: {
          title,
          content,
          contentFile: null,
        },
      })
    );

    formData.append(
      "map",
      JSON.stringify({
        "0": ["variables.contentFile"],
      })
    );

    formData.append("0", file);

    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "apollo-require-preflight": "true",
      },
      body: formData,
    });

    const result = await response.json();
    console.log("File upload response:", result);
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error(result.errors[0].message);
    }
    return result.data.createDocument;
  } else {
    // Text-only upload without file
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: `
          mutation CreateDocument($title: String!, $content: String!) {
            createDocument(data: { title: $title, content: $content }) {
              id
              title
              content
            }
          }
        `,
        variables: { title, content },
      }),
    });

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data.createDocument;
  }
}

export async function updateDocument(id: string, title: string, content: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query: `
        mutation UpdateDocument($id: ID!, $title: String!, $content: String!) {
          updateDocument(where: { id: $id }, data: { title: $title, content: $content }) {
            id
            title
            content
          }
        }
      `,
      variables: { id, title, content },
    }),
  });

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data.updateDocument;
}

export async function deleteDocument(id: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query: `
        mutation DeleteDocument($id: ID!) {
          deleteDocument(where: { id: $id }) {
            id
          }
        }
      `,
      variables: { id },
    }),
  });

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data.deleteDocument;
}
