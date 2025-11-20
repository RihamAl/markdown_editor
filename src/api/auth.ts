import { heading } from "@uiw/react-md-editor";

export async function signup(name: string, email: string, password: string) {
    const response = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            query: `
                mutation {
                    createUser(data: { name: "${name}", email: "${email}", password: "${password}" }) {
                        id
                        email
                    }
                }
            `
        }),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data.createUser;
}



export async function login(email: string, password: string) {
    const response = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST', 
        credentials: 'include',// VERY important for Keystone sessions
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    authenticateUserWithPassword(email: "${email}", password: "${password}") {
                        ... on UserAuthenticationWithPasswordSuccess {
                            sessionToken
                            item {
                                id
                                name
                                email
                            }
                        }
                    }
                }
            `
        }),
    });
    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data.authenticateUserWithPassword;

}


export async function logoutUser() {
    const response = await fetch('http://localhost:3000/api/graphql' ,{
        method:"POST" ,
        credentials: "include"      ,
        headers:{"Content-Type": "application/json" },
        body: JSON.stringify({
        query: `
            mutation {
                endSession
            }
      `,
    }),
  });

  return response.json();
}

export async function getCurrentUser() {
    const response = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST', 
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body:JSON.stringify({
            query:`
            query{
            authenticatedItem{
            ... on User{
            id
            name
            email
            }
            }
            }`,
        }),
    }); 
    const result = await response.json() ;
    return result.data.authenticatedItem;
}

