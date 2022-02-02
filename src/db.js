const users = [
  {
    id: '1',
    name: 'DDZed',
    email: 'ddz@ex.com',
    age: 46,
  },
  {
    id: '2',
    name: 'Wilson',
    email: 'wilson@ex.com',
  },
  {
    id: '3',
    name: 'Homie',
    email: 'homie@ex.com',
    age: 23,
  },
];

const posts = [
  {
    id: '256',
    title: "const's make it rain!",
    body: "I'm singing in the rain!",
    published: true,
    author: '1',
  },
  {
    id: '157',
    title: 'E plurbus unum',
    body: 'moxyu poxy',
    published: false,
    author: '1',
  },
  {
    id: '158',
    title: 'Mix Master Nike',
    body: 'Rainy shoes',
    published: true,
    author: '2',
  },
  {
    id: '159',
    title: 'Do androids dream electric dreams?',
    body: 'NO!',
    published: false,
    author: '3',
  },
  {
    id: '160',
    title: 'Blah Blah Blah',
    body: 'Bah Hangaburger!',
    published: true,
    author: '2',
  },
];

const comments = [
  {
    id: '10',
    text: "Well, that's lame!",
    author: '1',
    post: '159',
  },
  {
    id: '11',
    text: 'LOL',
    author: '1',
    post: '159',
  },
  {
    id: '12',
    text: 'diligaf!',
    author: '2',
    post: '157',
  },
  {
    id: '13',
    text: 'Hrm, I thought this was free.',
    author: '3',
    post: '160',
  },
  {
    id: '14',
    text: 'But Nope!',
    author: '3',
    post: '160',
  },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
