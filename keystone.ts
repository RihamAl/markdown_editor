// keystone.ts
import 'dotenv/config'; // ✅ هذا يحمّل القيم من .env مباشرة
import { config, list } from '@keystone-6/core';
import { text, password, relationship } from '@keystone-6/core/fields';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import { OAuth2Client } from 'google-auth-library';

// Session setup
const sessionSecret = 'a really long random string at least 32 chars';
const session = statelessSessions({
  secret: sessionSecret,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secure: false, // important because it is local
  sameSite: 'lax',
  path: '/',
});

// Authentication setup
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id name email', // we need id, name, and email inside the session
});

// User list (model)
export const User = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),
    password: password(),
    // add the inverse relationship so Keystone knows the connection between users and documents
    documents: relationship({ ref: 'Document.owner', many: true }),
  },
});

// Document list (model)
export const Document = list({
  access: {
    operation: {
      query: ({ session }) => !!session?.itemId,
      create: ({ session }) => !!session?.itemId,
      update: ({ session }) => !!session?.itemId,
      delete: ({ session }) => !!session?.itemId,
    },
    filter: {
      query: ({ session }) => {
        if (!session?.itemId) return false;
        return { owner: { id: { equals: session.itemId } } };
      },
      update: ({ session }) => {
        if (!session?.itemId) return false;
        return { owner: { id: { equals: session.itemId } } };
      },
      delete: ({ session }) => {
        if (!session?.itemId) return false;
        return { owner: { id: { equals: session.itemId } } };
      },
    },
  },

  fields: {
    title: text({ validation: { isRequired: true } }),
    content: text(),
    owner: relationship({ ref: 'User.documents' }), // link with the correct relationship
  },

  hooks: {
    resolveInput: ({ resolvedData, operation, context }) => {
      if (operation === 'create') {
        // Keystone أحياناً يعطي session.itemId أو session.data.id
        const userId = context.session?.itemId || context.session?.data?.id;
        console.log('Creating document for user:', userId); // for debugging session
        if (userId) {
          resolvedData.owner = { connect: { id: userId } };
        }
      }
      return resolvedData;
    },
  },
});

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


// Export Keystone configuration
export default withAuth(
  config({
    db: { provider: 'sqlite', url: 'file:./keystone.db' },
    lists: { User, Document },
    session,
    server: {
      port: 3000,
      cors: { origin: ['http://localhost:5173'], credentials: true },
      extendExpressApp: (app, context ) => {

        // ----- Route to redirect to Google -----
        app.get('/auth/google', (req, res) => {
          const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['profile', 'email'],
          });
          res.redirect(url);
        });

        // ----- Google callback route -----
        app.get('/auth/google/callback', async (req, res) => {
          try {
            const { code } = req.query;
            if (!code) return res.status(400).send('No code provided');

            const { tokens } = await oauth2Client.getToken(code as string);
            oauth2Client.setCredentials(tokens);

            const ticket = await oauth2Client.verifyIdToken({
              idToken: tokens.id_token!,
              audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload()!;
            const email = payload.email!;
            const name = payload.name || 'No Name';

            // البحث أو إنشاء المستخدم
            let user = await context.db.User.findOne({ where: { email } });
            if (!user) {
              user = await context.db.User.createOne({ data: { email, name } });
            }

            res.redirect('http://localhost:5173/documents'); // redirect to frontend
          } catch (err) {
            console.error(err);
            res.status(500).send('Google login failed');
          }
        });

      },
    },
  })
);