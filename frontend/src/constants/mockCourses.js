export const mockCourses = [
  {
    _id: 'mern-mastery',
    title: 'MERN Stack Mastery',
    description:
      'Build production-ready apps with MongoDB, Express, React, Node.js, authentication, and deployment workflows.',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    price: 49,
    rating: 4.8,
    reviews: 128,
    students: 2400,
    category: 'Web Development',
    level: 'Intermediate',
    createdAt: '2026-02-10',
    instructor: { name: 'Aarav Mehta' },
    lectures: [
      { title: 'Project Setup and Architecture', duration: '18 mins' },
      { title: 'REST APIs with Express', duration: '24 mins' },
      { title: 'React Dashboard Flow', duration: '31 mins' },
    ],
  },
  {
    _id: 'react-patterns',
    title: 'Advanced React Patterns',
    description:
      'Level up your React apps with reusable hooks, route guards, context patterns, and polished UI composition.',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80',
    price: 39,
    rating: 4.7,
    reviews: 94,
    students: 1800,
    category: 'Web Development',
    level: 'Advanced',
    createdAt: '2026-03-01',
    instructor: { name: 'Nisha Rao' },
    lectures: [
      { title: 'Composition First Components', duration: '16 mins' },
      { title: 'Context without Re-render Pain', duration: '22 mins' },
      { title: 'Polished Async States', duration: '19 mins' },
    ],
  },
  {
    _id: 'uiux-foundations',
    title: 'UI/UX Design Foundations',
    description:
      'Design clean learning experiences with hierarchy, spacing, color systems, and practical product thinking.',
    thumbnail:
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80',
    price: 29,
    rating: 4.6,
    reviews: 76,
    students: 1250,
    category: 'UI/UX Design',
    level: 'Beginner',
    createdAt: '2026-01-18',
    instructor: { name: 'Kabir Sen' },
    lectures: [
      { title: 'Visual Hierarchy', duration: '14 mins' },
      { title: 'Color and Contrast', duration: '17 mins' },
      { title: 'Designing Course Cards', duration: '21 mins' },
    ],
  },
  {
    _id: 'data-python',
    title: 'Python for Data Science',
    description:
      'Analyze real datasets with Python, notebooks, visualization techniques, and practical model evaluation.',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    price: 59,
    rating: 4.9,
    reviews: 142,
    students: 3100,
    category: 'Data Science',
    level: 'Intermediate',
    createdAt: '2026-04-05',
    instructor: { name: 'Maya Iyer' },
    lectures: [
      { title: 'Notebook Workflow', duration: '20 mins' },
      { title: 'Data Cleaning Essentials', duration: '28 mins' },
      { title: 'Charts that Explain', duration: '23 mins' },
    ],
  },
];
