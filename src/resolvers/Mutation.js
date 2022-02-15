import { PubSub } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const emailTaken = db.users.some(user => user.email === data.email);

    if (emailTaken) {
      throw new Error('Email taken');
    }

    const user = {
      id: uuidv4(),
      ...data,
    };

    db.users.push(user);

    return user;
  },
  deleteUser(parent, { id }, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author === id;

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter(comment => comment.author !== args.id);

    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...data,
    };

    if (data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }
    db.posts.push(post);

    return post;
  },
  deletePost(parent, { id }, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        },
      });
    }

    db.comments = db.comments.filter(comment => comment.post !== id);

    return deletedPost;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const postToUpdate = db.posts.find(post => post.id === id);
    const originalPost = { ...postToUpdate };

    if (!postToUpdate) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      postToUpdate.title = data.title;
    }

    if (typeof data.body === 'string') {
      postToUpdate.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      postToUpdate.published = data.published;

      if (originalPost.published && !postToUpdate.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: postToUpdate,
          },
        });
      } else if (!originalPost.published && postToUpdate.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: postToUpdate,
          },
        });
      }
    } else if (postToUpdate.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: postToUpdate,
        },
      });
    }

    return postToUpdate;
  },
  createComment(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author);
    const postExists = db.posts.some(
      post => post.id === data.post && post.published
    );

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post');
    }

    const comment = {
      id: uuidv4(),
      ...data,
    };

    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });
    db.comments.push(comment);

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
