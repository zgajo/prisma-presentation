const { prisma } = require("./prisma/generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");

const resolvers = {
  Query: {
    publishedPosts(parent, args, context) {
      return context.prisma.posts({ where: { published: true } });
    },
    post(parent, args, context) {
      return context.prisma.post({ id: args.postId });
    },
    postsByUser(parent, args, context) {
      return context.prisma
        .user({
          id: args.userId
        })
        .posts();
    },
    users(parent, args, context, info) {
      return context.prisma.users({ ...args });
    }
  },
  Mutation: {
    createDraft(parent, args, context) {
      return context.prisma.createPost({
        title: args.title,
        author: {
          connect: { id: args.userId }
        }
      });
    },
    publish(parent, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: { published: true }
      });
    },
    createUser(parent, args, context) {
      return context.prisma.createUser({ name: args.name });
    },
    updateUser(parent, args, context) {
      return context.prisma.updateUser({ ...args });
    }
  },
  User: {
    posts(parent, args, context) {
      return context.prisma
        .user({
          id: parent.id
        })
        .posts();
    },
    following(parent, args, context) {
      return context.prisma
        .user({
          id: parent.id
        })
        .following();
    },
    followers(parent, args, context) {
      return context.prisma
        .user({
          id: parent.id
        })
        .followers();
    }
  },
  Post: {
    author(parent, args, context) {
      return context.prisma
        .post({
          id: parent.id
        })
        .author();
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers,
  context: {
    prisma
  }
});
server.start(() => console.log("Server is running on http://localhost:4000"));
