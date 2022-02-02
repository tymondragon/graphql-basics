const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish('count', {
          count: count,
        });
      }, 1000);

      return pubsub.asyncIterator('count');
    },
  },
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(p => p.id = postId && p.published);
      if (!post) {
        throw new Error('Post not found')
      }
      return pubsub.asyncIterator(`comment ${postId}`)
    },
  },
};

export { Subscription as default };
