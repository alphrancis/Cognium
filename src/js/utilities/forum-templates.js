
const postTemplate = {
    id: null,
    title: '',
    content: '',
    author: {
        name: '',
        avatar: ''
    },
    category: '',
    tags: [],
    timestamp: '',
    stats: {
        views: 0,
        replies: 0,
        likes: 0
    }
};
const examplePost = {
    id: 1,
    title: 'Understanding Calculus Basics',
    content: 'I\'m having trouble understanding the fundamental concepts of calculus...',
    author: {
        name: 'John Doe',
        avatar: 'assets/avatars/default.jpg'
    },
    category: 'study',
    tags: ['calculus', 'mathematics', 'help'],
    timestamp: '2024-03-20T10:00:00Z',
    stats: {
        views: 120,
        replies: 5,
        likes: 0
    }
}; 